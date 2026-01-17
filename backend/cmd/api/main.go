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

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/gin-gonic/gin"
)

// Gin router instance.
var router *gin.Engine

// init runs once when the function is initialized.
func init() {
	log.Println("Backend server initializing (Cloud Function)...")

	// In a real Cloud Function environment, env vars are set via the platform.
	// This LoadEnv is useful for local development with `go run` or functions-framework.
	log.Println("Loading environment variables if available...")
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
	router = gin.Default()

	// Flexible CORS middleware. For production, a strict whitelist is recommended.
	router.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		// For development, dynamically allow the origin.
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
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

	// Register the gin router as an HTTP-triggered Cloud Function.
	// The name "api" must match the function name in firebase.json.
	functions.HTTP("api", router.ServeHTTP)
	log.Println("Gin router successfully registered as Cloud Function 'api'.")
}

// main is a dummy entry point for local development (e.g., using `go run`).
// It is NOT executed in the Cloud Functions environment.
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting local development server on port %s", port)
	if router != nil {
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("CRITICAL: Failed to start local server: %v", err)
		}
	} else {
		log.Fatal("Router not initialized. The 'init' function might have failed.")
	}
}
