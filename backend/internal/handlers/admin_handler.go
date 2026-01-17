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

// MakeAdminHandler atribui o papel de administrador a um usuário.
// Esta rota deve ser protegida para ser acessível apenas por outros administradores.
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

	// 1. Atualizar Custom Claims no Firebase Auth
	claims := map[string]interface{}{"role": "admin"}
	err = firebase.AuthClient.SetCustomUserClaims(context.Background(), user.UID, claims)
	if err != nil {
		log.Printf("Erro ao definir custom claims para UID %s: %v", user.UID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao definir a claim de admin no Auth")
		return
	}

	// 2. Atualizar o papel no documento do usuário no Firestore
	userRef := firebase.FirestoreClient.Collection("users").Doc(user.UID)
	_, err = userRef.Update(context.Background(), []firestore.Update{
		{Path: "role", Value: "admin"},
	})
	if err != nil {
		log.Printf("Erro ao atualizar o papel do usuário no Firestore para UID %s: %v", user.UID, err)
		// Neste ponto, o Auth foi atualizado, mas o Firestore não.
		// É importante logar isso para uma possível correção manual.
		utils.Error(c, http.StatusInternalServerError, "Falha ao atualizar o papel do usuário no banco de dados.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": fmt.Sprintf("Usuário %s agora é um administrador.", p.Email)})
}
