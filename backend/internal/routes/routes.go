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

	// Rota pública para provisionamento de conta
	r.POST("/provision-account", handlers.ProvisionAccountHandler)

	// Agrupa as rotas públicas de autenticação
	authRouter := r.Group("/auth")
	{
		authRouter.POST("/register", handlers.RegisterHandler)
		authRouter.POST("/login", handlers.LoginHandler)
		authRouter.POST("/logout", handlers.LogoutHandler)
		authRouter.POST("/verify-token", handlers.VerifyTokenHandler)
		authRouter.POST("/make-admin", handlers.MakeAdminHandler) // Idealmente, esta rota deveria ser protegida
	}

	// Agrupa as rotas protegidas que exigem autenticação
	userRouter := r.Group("/user")
	userRouter.Use(middleware.AuthMiddleware())
	{
		userRouter.GET("/profile", handlers.GetProfileHandler)
	}

	// TODO: Implementar rotas do admin com middleware de verificação de admin
	// adminRouter := r.Group("/api/admin")
	// adminRouter.Use(middleware.AuthMiddleware())
	// adminRouter.Use(middleware.AdminOnly()) // Um middleware que verifica a claim de admin
	// {
	// 	adminRouter.GET("/dashboard", handlers.AdminDashboardHandler)
	// }
}
