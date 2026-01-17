package middleware

import (
	"net/http"

	"backend/internal/session"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// AdminMiddleware protege rotas que só podem ser acessadas por administradores.
// Ele deve ser usado DEPOIS do AuthMiddleware.
// Este middleware verifica o papel ('role') armazenado na sessão.
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		sess, err := session.Store.Get(c.Request, session.Name)
		if err != nil || sess.IsNew {
			utils.Error(c, http.StatusUnauthorized, "Sessão inválida")
			c.Abort()
			return
		}

		// Verifica se a claim de admin está na sessão.
		role, ok := sess.Values["role"].(string)
		if !ok || role != "admin" {
			utils.Error(c, http.StatusForbidden, "Acesso negado. Requer privilégios de administrador.")
			c.Abort()
			return
		}

		// Se chegamos aqui, o usuário é um administrador.
		c.Next()
	}
}
