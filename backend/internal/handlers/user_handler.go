package handlers

import (
	"net/http"

	"backend/internal/session"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type ProfileResponse struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
}

// MeHandler retorna o perfil do usuário logado.
func MeHandler(c *gin.Context) {
	// O middleware já validou a sessão. Podemos acessar os valores com segurança.
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok1 := sess.Values["userID"].(string)
	email, ok2 := sess.Values["email"].(string)

	if !ok1 || !ok2 {
		utils.Error(c, http.StatusInternalServerError, "Dados de sessão inválidos")
		return
	}

	utils.Success(c, http.StatusOK, ProfileResponse{
		UserID: userID,
		Email:  email,
	})
}
