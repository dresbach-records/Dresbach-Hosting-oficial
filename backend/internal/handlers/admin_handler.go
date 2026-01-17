package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"backend/internal/firebase"
	"backend/internal/utils"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

type CreateClientPayload struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

// CreateClientHandler cria um novo usuário no Firebase Auth e um documento de cliente no Firestore.
func CreateClientHandler(c *gin.Context) {
	var p CreateClientPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	// 1. Criar usuário no Firebase Authentication
	params := (&auth.UserToCreate{}).
		Email(p.Email).
		Password(p.Password).
		DisplayName(fmt.Sprintf("%s %s", p.FirstName, p.LastName)).
		EmailVerified(true). // Admin está criando, então podemos considerar verificado
		Disabled(false)

	userRecord, err := firebase.AuthClient.CreateUser(context.Background(), params)
	if err != nil {
		if auth.IsEmailAlreadyExists(err) {
			utils.Error(c, http.StatusConflict, "O email já está em uso")
			return
		}
		log.Printf("Erro ao criar usuário no Auth: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar o usuário no sistema de autenticação")
		return
	}

	// 2. Criar documento do cliente no Firestore
	clientData := map[string]interface{}{
		"id":          userRecord.UID,
		"firstName":   p.FirstName,
		"lastName":    p.LastName,
		"email":       p.Email,
		"createdAt":   time.Now().Format(time.RFC3339),
		"status":      "Ativo",
		"phoneNumber": "",
		"address":     "",
	}

	_, err = firebase.FirestoreClient.Collection("clients").Doc(userRecord.UID).Set(context.Background(), clientData)
	if err != nil {
		log.Printf("Erro ao criar documento do cliente no Firestore para UID %s: %v", userRecord.UID, err)
		// Opcional: deletar o usuário do Auth para consistência, ou lidar com isso manualmente.
		utils.Error(c, http.StatusInternalServerError, "Falha ao salvar os dados do cliente")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Cliente criado com sucesso", "clientId": userRecord.UID})
}
