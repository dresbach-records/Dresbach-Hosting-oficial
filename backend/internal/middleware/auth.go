package middleware

import (
	"net/http"

	"backend/internal/session"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware protege rotas verificando a sessão do usuário.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess, err := session.Store.Get(c.Request, session.Name)
		if err != nil {
			// Isso pode acontecer se o cookie estiver malformado.
			utils.Error(c, http.StatusUnauthorized, "Cookie de sessão inválido")
			c.Abort()
			return
		}

		// Se a sessão é nova, não está autenticada.
		if sess.IsNew {
			utils.Error(c, http.StatusUnauthorized, "Autenticação requerida")
			c.Abort()
			return
		}

		// Verifica se a sessão está autenticada (verificamos pelo userID).
		if userID, ok := sess.Values["userID"].(string); !ok || userID == "" {
			utils.Error(c, http.StatusUnauthorized, "Autenticação requerida")
			c.Abort()
			return
		}

		// Se chegamos aqui, o usuário está autenticado.
		c.Next()
	}
}
