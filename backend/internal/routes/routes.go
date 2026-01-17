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

	// Grupo principal da API v1
	api := r.Group("/api/v1")
	{
		// --- ROTAS PÚBLICAS DE AUTENTICAÇÃO ---
		authRouter := api.Group("/auth")
		{
			// Cria o usuário e o promove a admin se for o primeiro
			authRouter.POST("/register", handlers.RegisterHandler)
			// Rota de login segura baseada em ID Token do Firebase
			authRouter.POST("/session-login", handlers.SessionLoginHandler)
			authRouter.POST("/logout", handlers.LogoutHandler)

			// Rota de login legada, marcada como insegura.
			// authRouter.POST("/login", handlers.LoginHandler) 
		}


		// --- ROTAS PÚBLICAS DIVERSAS ---
		api.GET("/domains/lookup/:domain", handlers.DomainLookupHandler)

		// --- GRUPO DE ROTAS AUTENTICADAS ---
		// O middleware AuthMiddleware() será aplicado a todos os grupos aninhados.
		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			// Rota para obter o perfil do usuário logado
			authenticated.GET("/auth/me", handlers.MeHandler)

			// Pagamentos
			authenticated.POST("/payments/create-intent", handlers.CreatePaymentIntentHandler)

			// Provisionamento de serviço para o cliente logado
			authenticated.POST("/provision-account", handlers.ProvisionAccountHandler)

			// --- ROTAS DA ÁREA DO CLIENTE ---
			clientRouter := authenticated.Group("/client")
			{
				clientRouter.GET("/dashboard", handlers.GetClientDashboard)
				clientRouter.GET("/services", handlers.ListClientServices)
				clientRouter.GET("/services/:id", handlers.GetClientService)
				clientRouter.GET("/invoices", handlers.ListClientInvoices)
				clientRouter.POST("/invoices/:id/pay", handlers.PayClientInvoice)
				clientRouter.GET("/tickets", handlers.ListClientTickets)
				clientRouter.POST("/tickets", handlers.CreateClientTicket)
				clientRouter.POST("/tickets/:id/reply", handlers.ReplyClientTicket)
			}

			// --- ROTAS DO PAINEL DE ADMIN ---
			adminRouter := authenticated.Group("/admin")
			adminRouter.Use(middleware.AdminMiddleware()) // Protege todas as rotas de admin
			{
				adminRouter.GET("/dashboard", handlers.GetAdminDashboard)
				adminRouter.POST("/make-admin", handlers.MakeAdminHandler)

				// Clientes
				adminRouter.GET("/clients", handlers.ListClients)
				adminRouter.POST("/clients", handlers.CreateClientHandler)
				adminRouter.GET("/clients/:id", handlers.GetClient)
				adminRouter.PUT("/clients/:id", handlers.UpdateClient)
				adminRouter.PUT("/clients/:id/suspend", handlers.SuspendClient)

				// Produtos (Planos)
				adminRouter.GET("/products", handlers.ListProducts)
				adminRouter.POST("/products", handlers.CreateProduct)
				adminRouter.PUT("/products/:id", handlers.UpdateProduct)

				// Serviços (Instâncias de Hosting)
				adminRouter.GET("/services", handlers.ListServices)
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
		}
	}
}
