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

	api := r.Group("/api/v1")
	{
		// --- ROTAS PÚBLICAS ---
		public := api.Group("/")
		{
			// Autenticação
			auth := public.Group("/auth")
			// O endpoint de registro foi removido. O frontend agora usa o SDK do Firebase para criar o usuário.
			// O backend sincroniza o usuário na primeira chamada a /session-login.
			auth.POST("/session-login", handlers.SessionLoginHandler)
			auth.POST("/logout", handlers.LogoutHandler)

			// Domínios
			public.GET("/domains/lookup/:domain", handlers.DomainLookupHandler)
		}

		// --- ROTAS AUTENTICADAS ---
		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			authenticated.GET("/auth/me", handlers.MeHandler)

			// Pagamentos e Provisionamento para o cliente logado
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
				
				// Gestão de Usuários e Permissões (pós-bootstrap)
				admin.POST("/make-admin", handlers.MakeAdminHandler)

				// Gestão de Clientes
				clients := admin.Group("/clients")
				{
					clients.GET("/", handlers.ListClients)
					clients.POST("/", handlers.CreateClientHandler)
					clients.GET("/:id", handlers.GetClient)
					clients.PUT("/:id", handlers.UpdateClient)
					clients.PUT("/:id/suspend", handlers.SuspendClient)
				}

				// Gestão de Produtos/Planos
				products := admin.Group("/products")
				{
					products.GET("/", handlers.ListProducts)
					products.POST("/", handlers.CreateProduct)
					products.PUT("/:id", handlers.UpdateProduct)
				}

				// Gestão de Serviços
				services := admin.Group("/services")
				{
					services.GET("/", handlers.ListServices)
					services.PUT("/:id/suspend", handlers.SuspendService)
					services.PUT("/:id/unsuspend", handlers.UnsuspendService)
					services.DELETE("/:id", handlers.TerminateService)
				}

				// Gestão de Faturas
				invoices := admin.Group("/invoices")
				{
					invoices.GET("/", handlers.ListInvoices)
					invoices.POST("/", handlers.CreateInvoice)
					invoices.PUT("/:id/pay", handlers.MarkInvoiceAsPaid)
				}
				
				// Gestão de Tickets
				tickets := admin.Group("/tickets")
				{
					tickets.GET("/", handlers.ListTickets)
					tickets.POST("/:id/reply", handlers.ReplyToTicket)
					tickets.PUT("/:id/status", handlers.UpdateTicketStatus)
				}

				// Gestão de Servidores WHM
				servers := admin.Group("/servers")
				{
					servers.GET("/", handlers.ListServers)
					servers.POST("/", handlers.CreateServer)
				}
			}
		}
	}
}
