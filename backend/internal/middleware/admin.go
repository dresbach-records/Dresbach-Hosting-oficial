package middleware

import (
	"net/http"

	"backend/internal/session"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// AdminMiddleware protege rotas que só podem ser acessadas por administradores.
// Ele deve ser usado DEPOIS do AuthMiddleware.
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess, err := session.Store.Get(c.Request, session.Name)
		if err != nil || sess.IsNew {
			utils.Error(c, http.StatusUnauthorized, "Sessão inválida")
			c.Abort()
			return
		}

		// Verifica se a claim de admin está na sessão.
		isAdmin, ok := sess.Values["isAdmin"].(bool)
		if !ok || !isAdmin {
			utils.Error(c, http.StatusForbidden, "Acesso negado. Requer privilégios de administrador.")
			c.Abort()
			return
		}

		// Se chegamos aqui, o usuário é um administrador.
		c.Next()
	}
}
