package main

import (
	"log"
	"net/http"
	"os"

	"backend/internal/config"
	"backend/internal/firebase"
	"backend/internal/routes"
	"backend/internal/session"
	"backend/internal/stripe"
	"backend/internal/whm"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Backend server starting up...")

	log.Println("Loading environment variables from root .env file...")
	err := config.LoadEnv("../..")
	if err != nil {
		log.Println("WARNING: Could not load .env file. Using system environment variables only.")
	} else {
		log.Println("Successfully loaded .env file.")
	}

	log.Println("Initializing Firebase services...")
	firebase.InitFirebase()
	log.Println("Firebase services initialized.")

	log.Println("Initializing WHM client...")
	whm.InitWhmClient()
	log.Println("WHM client initialized.")

	log.Println("Initializing Stripe client...")
	stripe.InitStripe()
	log.Println("Stripe client initialized.")

	log.Println("Initializing session store...")
	session.InitSessionStore()
	log.Println("Session store initialized.")

	log.Println("Configuring Gin router...")
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		// Em um ambiente de desenvolvimento com emuladores, o frontend e o backend podem ter origens diferentes.
		// Em produção, com o App Hosting, eles compartilham a mesma origem, então isso é menos crítico.
		// A URL do emulador do Firebase para Hosting é geralmente `http://localhost:XXXX`.
		// Permita a origem do seu frontend de desenvolvimento.
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:9002") // Ajuste se a porta do seu frontend for diferente
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	log.Println("CORS middleware configured.")


	routes.Register(router)
	log.Println("API routes registered.")

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
