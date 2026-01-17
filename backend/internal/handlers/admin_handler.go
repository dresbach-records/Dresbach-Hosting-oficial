package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"backend/internal/firebase"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type MakeAdminPayload struct {
	Email string `json:"email" binding:"required"`
}

// MakeAdminHandler atribui a claim de administrador a um usuário.
// Esta é uma rota de desenvolvimento/admin e deve ser protegida adequadamente.
func MakeAdminHandler(c *gin.Context) {
	var p MakeAdminPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	user, err := firebase.AuthClient.GetUserByEmail(context.Background(), p.Email)
	if err != nil {
		log.Printf("Erro ao obter usuário por email '%s': %v", p.Email, err)
		utils.Error(c, http.StatusNotFound, "Usuário não encontrado")
		return
	}

	claims := user.CustomClaims
	if claims == nil {
		claims = make(map[string]interface{})
	}
	claims["admin"] = true

	err = firebase.AuthClient.SetCustomUserClaims(context.Background(), user.UID, claims)
	if err != nil {
		log.Printf("Erro ao definir custom claims para UID %s: %v", user.UID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao definir a claim de admin")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": fmt.Sprintf("Usuário %s agora é um administrador.", p.Email)})
}
