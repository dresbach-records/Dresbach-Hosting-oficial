package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Register registra todas as rotas da aplicação de forma explícita.
func Register(r *gin.Engine) {
	// --- ROTA DE HEALTH CHECK PÚBLICA ---
	// Acessível via /health porque não está no grupo v1 e o rewrite do firebase.json é /api/**
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// --- ROTAS PÚBLICAS v1 ---
	r.POST("/v1/auth/session-login", handlers.SessionLoginHandler)
	r.POST("/v1/auth/logout", handlers.LogoutHandler)
	r.GET("/v1/domains/lookup/:domain", handlers.DomainLookupHandler)
	
	// --- ROTAS AUTENTICADAS (Middleware de Sessão) ---
	authenticated := r.Group("/v1")
	authenticated.Use(middleware.AuthMiddleware())
	{
		authenticated.GET("/auth/me", handlers.MeHandler)
		authenticated.POST("/payments/create-intent", handlers.CreatePaymentIntentHandler)
		authenticated.POST("/provision-account", handlers.ProvisionAccountHandler)

		// --- ROTAS DA ÁREA DO CLIENTE ---
		authenticated.GET("/client/dashboard", handlers.GetClientDashboard)
		authenticated.GET("/client/services", handlers.ListClientServices)
		authenticated.GET("/client/services/:id", handlers.GetClientService)
		authenticated.POST("/client/services/:id/sso", handlers.CreateCPanelSessionHandler)
		authenticated.GET("/client/services/:id/summary", handlers.GetAccountSummaryHandler)
		authenticated.GET("/client/invoices", handlers.ListClientInvoices)
		authenticated.POST("/client/invoices/:id/pay", handlers.PayClientInvoice)
		authenticated.GET("/client/tickets", handlers.ListClientTickets)
		authenticated.POST("/client/tickets", handlers.CreateClientTicket)
		authenticated.POST("/client/tickets/:id/reply", handlers.ReplyClientTicket)
		
		// --- ROTAS DO PAINEL DE ADMIN (Middleware de Admin) ---
		admin := authenticated.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			admin.GET("/dashboard", handlers.GetAdminDashboard)
			admin.POST("/make-admin", handlers.MakeAdminHandler)

			// Clientes (Admin)
			admin.GET("/clients", handlers.ListClients)
			admin.POST("/clients", handlers.CreateClientHandler)
			admin.GET("/clients/:id", handlers.GetClient)
			admin.PUT("/clients/:id", handlers.UpdateClient)
			admin.PUT("/clients/:id/suspend", handlers.SuspendClient)
			
			// Produtos (Admin)
			admin.GET("/products", handlers.ListProducts)
			admin.POST("/products", handlers.CreateProduct)
			admin.PUT("/products/:id", handlers.UpdateProduct)
			
			// Serviços (Admin)
			admin.GET("/services", handlers.ListServices)
			admin.PUT("/services/:id/suspend", handlers.SuspendService)
			admin.PUT("/services/:id/unsuspend", handlers.UnsuspendService)
			admin.DELETE("/services/:id", handlers.TerminateService)

			// Faturas (Admin)
			admin.GET("/invoices", handlers.ListInvoices)
			admin.POST("/invoices", handlers.CreateInvoice)
			admin.PUT("/invoices/:id/pay", handlers.MarkInvoiceAsPaid)

			// Tickets (Admin)
			admin.GET("/tickets", handlers.ListTickets)
			admin.POST("/tickets/:id/reply", handlers.ReplyToTicket)
			admin.PUT("/tickets/:id/status", handlers.UpdateTicketStatus)

			// Servidores (Admin)
			admin.GET("/servers", handlers.ListServers)
			admin.POST("/servers", handlers.CreateServer)
		}
	}
}
