package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register registra todas as rotas da aplicação.
func Register(r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api/v1")
	{
		authRouter := api.Group("/auth")
		{
			// Cria um usuário. O primeiro se torna admin automaticamente.
			authRouter.POST("/register", handlers.RegisterHandler)
			// Rota de login segura que cria uma sessão cookie a partir de um ID Token do Firebase.
			authRouter.POST("/session-login", handlers.SessionLoginHandler)
			authRouter.POST("/logout", handlers.LogoutHandler)
		}

		api.GET("/domains/lookup/:domain", handlers.DomainLookupHandler)
		
		// A rota para criar admin foi removida. O primeiro usuário registrado é promovido automaticamente.
		// api.POST("/make-admin", handlers.MakeAdminHandler)


		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			authenticated.GET("/auth/me", handlers.MeHandler)
			authenticated.POST("/payments/create-intent", handlers.CreatePaymentIntentHandler)
			authenticated.POST("/provision-account", handlers.ProvisionAccountHandler)

			clientRouter := authenticated.Group("/client")
			{
				clientRouter.GET("/dashboard", handlers.GetClientDashboard)
				clientRouter.GET("/services", handlers.ListClientServices)
				clientRouter.GET("/services/:id", handlers.GetClientService)
				clientRouter.POST("/services/:id/sso", handlers.CreateCPanelSessionHandler)
				clientRouter.GET("/services/:id/summary", handlers.GetAccountSummaryHandler)
				clientRouter.GET("/invoices", handlers.ListClientInvoices)
				clientRouter.POST("/invoices/:id/pay", handlers.PayClientInvoice)
				clientRouter.GET("/tickets", handlers.ListClientTickets)
				clientRouter.POST("/tickets", handlers.CreateClientTicket)
				clientRouter.POST("/tickets/:id/reply", handlers.ReplyClientTicket)
			}

			adminRouter := authenticated.Group("/admin")
			adminRouter.Use(middleware.AdminMiddleware())
			{
				// Endpoint para atribuir papel de admin a um usuário existente (para uso pós-bootstrap)
				adminRouter.POST("/make-admin", handlers.MakeAdminHandler)

				adminRouter.GET("/dashboard", handlers.GetAdminDashboard)
				adminRouter.GET("/clients", handlers.ListClients)
				adminRouter.POST("/clients", handlers.CreateClientHandler)
				adminRouter.GET("/clients/:id", handlers.GetClient)
				adminRouter.PUT("/clients/:id", handlers.UpdateClient)
				adminRouter.PUT("/clients/:id/suspend", handlers.SuspendClient)
				adminRouter.GET("/products", handlers.ListProducts)
				adminRouter.POST("/products", handlers.CreateProduct)
				adminRouter.PUT("/products/:id", handlers.UpdateProduct)
				adminRouter.GET("/services", handlers.ListServices)
				adminRouter.PUT("/services/:id/suspend", handlers.SuspendService)
				adminRouter.PUT("/services/:id/unsuspend", handlers.UnsuspendService)
				adminRouter.DELETE("/services/:id", handlers.TerminateService)
				adminRouter.GET("/invoices", handlers.ListInvoices)
				adminRouter.POST("/invoices", handlers.CreateInvoice)
				adminRouter.PUT("/invoices/:id/pay", handlers.MarkInvoiceAsPaid)
				adminRouter.GET("/tickets", handlers.ListTickets)
				adminRouter.POST("/tickets/:id/reply", handlers.ReplyToTicket)
				adminRouter.PUT("/tickets/:id/status", handlers.UpdateTicketStatus)
				adminRouter.GET("/servers", handlers.ListServers)
				adminRouter.POST("/servers", handlers.CreateServer)
			}
		}
	}
}
