package main

import (
	"log"
	"net/http"
	"os"

	"backend/internal/config"
	"backend/internal/firebase"
	"backend/internal/routes"
	"backend/internal/session"
	"backend/internal/stripe" // Importa o novo pacote Stripe
	"backend/internal/whm"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Backend server starting up...")

	// Carrega as variáveis de ambiente do arquivo .env
	log.Println("Loading environment variables from root .env file...")
	err := config.LoadEnv("../..") // Carrega a partir da raiz do projeto
	if err != nil {
		log.Println("WARNING: Could not load .env file. Using system environment variables only.")
	} else {
		log.Println("Successfully loaded .env file.")
	}

	log.Println("Initializing Firebase services...")
	// Inicializa os serviços do Firebase
	firebase.InitFirebase()
	log.Println("Firebase services initialized.")

	log.Println("Initializing WHM client...")
	// Inicializa o cliente WHM
	whm.InitWhmClient()
	log.Println("WHM client initialized.")

	log.Println("Initializing Stripe client...")
	// Inicializa o cliente Stripe
	stripe.InitStripe()
	log.Println("Stripe client initialized.")

	log.Println("Initializing session store...")
	// Inicializa a store de sessão
	session.InitSessionStore()
	log.Println("Session store initialized.")

	log.Println("Configuring Gin router...")
	// Configura o roteador Gin
	router := gin.Default()

	// Configura CORS (essencial para desenvolvimento local)
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:9002")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	log.Println("CORS middleware configured.")


	// Registra todas as rotas da aplicação
	routes.Register(router)
	log.Println("API routes registered.")


	// Inicia o servidor. Cloud Run define a porta através da variável de ambiente PORT.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("PORT not defined, using default port %s", port)
	}

	log.Printf("Server is now listening on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("CRITICAL: Failed to start server: %v", err)
	}
}
