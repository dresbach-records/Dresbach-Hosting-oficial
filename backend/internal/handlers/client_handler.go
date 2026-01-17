package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"backend/internal/firebase"
	"backend/internal/utils"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

type CreateClientPayload struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

// CreateClientHandler cria um novo usuário no Firebase Auth e um documento de cliente no Firestore (Ação de Admin).
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

// ListClients lista todos os clientes. (Admin)
func ListClients(c *gin.Context) {
	ctx := context.Background()
	iter := firebase.FirestoreClient.Collection("clients").Documents(ctx)
	docs, err := iter.GetAll()
	if err != nil {
		log.Printf("Erro ao listar clientes: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao buscar lista de clientes.")
		return
	}

	clients := make([]map[string]interface{}, 0, len(docs))
	for _, doc := range docs {
		clients = append(clients, doc.Data())
	}

	utils.Success(c, http.StatusOK, clients)
}

// GetClient obtém um cliente específico. (Admin)
func GetClient(c *gin.Context) {
	clientID := c.Param("id")
	if clientID == "" {
		utils.Error(c, http.StatusBadRequest, "O ID do cliente é obrigatório")
		return
	}

	doc, err := firebase.FirestoreClient.Collection("clients").Doc(clientID).Get(context.Background())
	if err != nil {
		log.Printf("Erro ao buscar cliente %s: %v", clientID, err)
		utils.Error(c, http.StatusNotFound, "Cliente não encontrado.")
		return
	}

	utils.Success(c, http.StatusOK, doc.Data())
}

// UpdateClient atualiza um cliente. (Admin)
func UpdateClient(c *gin.Context) {
	clientID := c.Param("id")
	if clientID == "" {
		utils.Error(c, http.StatusBadRequest, "O ID do cliente é obrigatório")
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	// Remove campos que não devem ser alterados diretamente por esta rota
	delete(updates, "id")
	delete(updates, "email")
	delete(updates, "createdAt")

	_, err := firebase.FirestoreClient.Collection("clients").Doc(clientID).Set(context.Background(), updates, firestore.MergeAll)
	if err != nil {
		log.Printf("Erro ao atualizar cliente %s: %v", clientID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao atualizar dados do cliente.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Cliente atualizado com sucesso."})
}


// SuspendClient suspende um cliente. (Admin)
func SuspendClient(c *gin.Context) {
	// TODO: Implementar lógica de suspensão completa, incluindo suspensão de serviços no WHM.
	// Por enquanto, esta função apenas atualiza o status do cliente no Firestore.
	clientID := c.Param("id")
	if clientID == "" {
		utils.Error(c, http.StatusBadRequest, "O ID do cliente é obrigatório")
		return
	}

	updateData := map[string]interface{}{
		"status": "Suspenso",
	}

	_, err := firebase.FirestoreClient.Collection("clients").Doc(clientID).Set(context.Background(), updateData, firestore.MergeAll)
	if err != nil {
		log.Printf("Erro ao suspender cliente %s: %v", clientID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao suspender cliente.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Cliente suspenso com sucesso."})
}

