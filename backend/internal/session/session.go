package session

import (
	"log"
	"os"

	"github.com/gorilla/sessions"
)

var (
	Store *sessions.CookieStore
	Name  = "dresbach-hosting-session"
)

// InitSessionStore inicializa a store de cookies para gerenciamento de sessão.
func InitSessionStore() {
	sessionKey := os.Getenv("SESSION_KEY")
	if sessionKey == "" {
		log.Fatal("A variável de ambiente SESSION_KEY não está definida. Deve ser uma string longa e aleatória.")
	}
	Store = sessions.NewCookieStore([]byte(sessionKey))

	Store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 7 dias
		HttpOnly: true,
	}
	log.Println("Session store inicializada.")
}
