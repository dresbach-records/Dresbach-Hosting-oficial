package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register registra todas as rotas da aplicação.
func Register(r *gin.Engine) {
	// Rota de health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Agrupa as rotas públicas de autenticação
	authRouter := r.Group("/auth")
	{
		authRouter.POST("/register", handlers.RegisterHandler)
		authRouter.POST("/login", handlers.LoginHandler)
		authRouter.POST("/logout", handlers.LogoutHandler)
		authRouter.POST("/verify-token", handlers.VerifyTokenHandler)
		// Esta rota será movida para dentro do grupo de admin por segurança
		// authRouter.POST("/make-admin", handlers.MakeAdminHandler)
	}

	// API Group - Todas as rotas aqui dentro exigem autenticação de sessão
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		// Rotas de usuário autenticado
		userRouter := api.Group("/user")
		{
			userRouter.GET("/profile", handlers.GetProfileHandler)
		}

		// Rota para provisionamento de conta (agora protegida)
		api.POST("/provision-account", handlers.ProvisionAccountHandler)

		// Rotas de administrador
		adminRouter := api.Group("/admin")
		adminRouter.Use(middleware.AdminMiddleware()) // Middleware extra para checar se é admin
		{
			// Exemplo: adminRouter.GET("/dashboard", handlers.AdminDashboardHandler)
			adminRouter.POST("/create-client", handlers.CreateClientHandler)
			// A rota para tornar um usuário admin agora é protegida e só pode ser usada por outros admins.
			adminRouter.POST("/make-admin", handlers.MakeAdminHandler)
		}
	}
}
