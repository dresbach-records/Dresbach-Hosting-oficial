package main

import (
	"log"
	"net/http"
	"os"

	"backend/internal/config"
	"backend/internal/firebase"
	"backend/internal/routes"
	"backend/internal/session"
	"backend/internal/whm" // Import the new WHM package

	"github.com/gin-gonic/gin"
)

func main() {
	// Carrega as variáveis de ambiente do arquivo .env
	err := config.LoadEnv("../..") // Carrega a partir da raiz do projeto
	if err != nil {
		log.Println("Aviso: não foi possível carregar o arquivo .env, usando variáveis de ambiente do sistema.")
	}

	// Inicializa os serviços do Firebase
	firebase.InitFirebase()

	// Inicializa o cliente WHM
	whm.InitWhmClient()

	// Inicializa a store de sessão
	session.InitSessionStore()

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

	// Registra todas as rotas da aplicação
	routes.Register(router)

	// Inicia o servidor. Cloud Run define a porta através da variável de ambiente PORT.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("PORT não definida, usando porta padrão %s", port)
	}

	log.Printf("Servidor iniciando na porta %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Falha ao iniciar o servidor: %v", err)
	}
}
