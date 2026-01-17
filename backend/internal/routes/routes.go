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

	// --- ROTAS PÚBLICAS ---
	authRouter := r.Group("/auth")
	{
		authRouter.POST("/register", handlers.RegisterHandler)
		authRouter.POST("/login", handlers.LoginHandler)
		authRouter.POST("/logout", handlers.LogoutHandler)
		authRouter.POST("/verify-token", handlers.VerifyTokenHandler)
	}

	// --- GRUPO DE API AUTENTICADO ---
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		// --- ROTAS DA ÁREA DO CLIENTE ---
		clientRouter := api.Group("/client")
		{
			clientRouter.GET("/dashboard", handlers.GetClientDashboard)
			clientRouter.GET("/services", handlers.ListClientServices)
			clientRouter.GET("/services/:id", handlers.GetClientService)
			clientRouter.GET("/invoices", handlers.ListClientInvoices)
			clientRouter.POST("/invoices/:id/pay", handlers.PayClientInvoice)
			clientRouter.GET("/tickets", handlers.ListClientTickets)
			clientRouter.POST("/tickets", handlers.CreateClientTicket)
			clientRouter.POST("/tickets/:id/reply", handlers.ReplyClientTicket)
			clientRouter.GET("/profile", handlers.GetProfileHandler) // Reutiliza o handler existente
		}

		// --- ROTAS DO PAINEL DE ADMIN ---
		adminRouter := api.Group("/admin")
		adminRouter.Use(middleware.AdminMiddleware()) // Protege todas as rotas de admin
		{
			adminRouter.GET("/dashboard", handlers.GetAdminDashboard)
			adminRouter.POST("/make-admin", handlers.MakeAdminHandler) // Ferramenta de dev

			// Clientes
			adminRouter.GET("/clients", handlers.ListClients)
			adminRouter.POST("/clients", handlers.CreateClientHandler) // Reutiliza o handler
			adminRouter.GET("/clients/:id", handlers.GetClient)
			adminRouter.PUT("/clients/:id", handlers.UpdateClient)
			adminRouter.PUT("/clients/:id/suspend", handlers.SuspendClient)

			// Produtos (Planos)
			adminRouter.GET("/products", handlers.ListProducts)
			adminRouter.POST("/products", handlers.CreateProduct)
			adminRouter.PUT("/products/:id", handlers.UpdateProduct)

			// Serviços (Instâncias de Hosting)
			adminRouter.GET("/services", handlers.ListServices)
			adminRouter.POST("/services/provision", handlers.ProvisionAccountHandler) // Rota de provisionamento
			adminRouter.PUT("/services/:id/suspend", handlers.SuspendService)
			adminRouter.PUT("/services/:id/unsuspend", handlers.UnsuspendService)
			adminRouter.DELETE("/services/:id", handlers.TerminateService)

			// Faturas
			adminRouter.GET("/invoices", handlers.ListInvoices)
			adminRouter.POST("/invoices", handlers.CreateInvoice)
			adminRouter.PUT("/invoices/:id/pay", handlers.MarkInvoiceAsPaid)

			// Tickets
			adminRouter.GET("/tickets", handlers.ListTickets)
			adminRouter.POST("/tickets/:id/reply", handlers.ReplyToTicket)
			adminRouter.PUT("/tickets/:id/status", handlers.UpdateTicketStatus)

			// Servidores
			adminRouter.GET("/servers", handlers.ListServers)
			adminRouter.POST("/servers", handlers.CreateServer)
		}

		// --- ROTAS COMPARTILHADAS (Ex: Pagamento) ---
		// O middleware AuthMiddleware já protege este grupo
		api.POST("/payments/create-intent", handlers.CreatePaymentIntentHandler)
	}
}
