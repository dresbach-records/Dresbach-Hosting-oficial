package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register registra todas as rotas da aplicação.
func Register(r *gin.Engine) {
	// Rota de health check pública
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	apiV1 := r.Group("/api/v1")
	{
		// --- ROTAS PÚBLICAS ---
		authPublic := apiV1.Group("/auth")
		{
			authPublic.POST("/session-login", handlers.SessionLoginHandler)
			authPublic.POST("/logout", handlers.LogoutHandler)
		}
		apiV1.GET("/domains/lookup/:domain", handlers.DomainLookupHandler)

		// --- ROTAS AUTENTICADAS (CLIENTE E/OU ADMIN) ---
		authenticated := apiV1.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			authenticated.GET("/auth/me", handlers.MeHandler)
			authenticated.POST("/payments/create-intent", handlers.CreatePaymentIntentHandler)
			authenticated.POST("/provision-account", handlers.ProvisionAccountHandler)

			// --- ROTAS DA ÁREA DO CLIENTE ---
			client := authenticated.Group("/client")
			{
				client.GET("/dashboard", handlers.GetClientDashboard)

				services := client.Group("/services")
				{
					services.GET("/", handlers.ListClientServices)
					services.GET("/:id", handlers.GetClientService)
					services.POST("/:id/sso", handlers.CreateCPanelSessionHandler)
					services.GET("/:id/summary", handlers.GetAccountSummaryHandler)
				}
				
				invoices := client.Group("/invoices")
				{
					invoices.GET("/", handlers.ListClientInvoices)
					invoices.POST("/:id/pay", handlers.PayClientInvoice)
				}

				tickets := client.Group("/tickets")
				{
					tickets.GET("/", handlers.ListClientTickets)
					tickets.POST("/", handlers.CreateClientTicket)
					tickets.POST("/:id/reply", handlers.ReplyClientTicket)
				}
			}

			// --- ROTAS DO PAINEL DE ADMIN ---
			admin := authenticated.Group("/admin")
			admin.Use(middleware.AdminMiddleware())
			{
				admin.GET("/dashboard", handlers.GetAdminDashboard)
				admin.POST("/make-admin", handlers.MakeAdminHandler)

				clients := admin.Group("/clients")
				{
					clients.GET("/", handlers.ListClients)
					clients.POST("/", handlers.CreateClientHandler)
					clients.GET("/:id", handlers.GetClient)
					clients.PUT("/:id", handlers.UpdateClient)
					clients.PUT("/:id/suspend", handlers.SuspendClient)
				}

				products := admin.Group("/products")
				{
					products.GET("/", handlers.ListProducts)
					products.POST("/", handlers.CreateProduct)
					products.PUT("/:id", handlers.UpdateProduct)
				}

				services := admin.Group("/services")
				{
					services.GET("/", handlers.ListServices)
					services.PUT("/:id/suspend", handlers.SuspendService)
					services.PUT("/:id/unsuspend", handlers.UnsuspendService)
					services.DELETE("/:id", handlers.TerminateService)
				}

				invoices := admin.Group("/invoices")
				{
					invoices.GET("/", handlers.ListInvoices)
					invoices.POST("/", handlers.CreateInvoice)
					invoices.PUT("/:id/pay", handlers.MarkInvoiceAsPaid)
				}
				
				tickets := admin.Group("/tickets")
				{
					tickets.GET("/", handlers.ListTickets)
					tickets.POST("/:id/reply", handlers.ReplyToTicket)
					tickets.PUT("/:id/status", handlers.UpdateTicketStatus)
				}

				servers := admin.Group("/servers")
				{
					servers.GET("/", handlers.ListServers)
					servers.POST("/", handlers.CreateServer)
				}
			}
		}
	}
}
