package handlers

import (
	"backend/internal/domain/constants"
	"backend/internal/firebase"
	"backend/internal/models"
	"backend/internal/session"
	"backend/internal/utils"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// --- Handlers da Área do Cliente ---

// ListClientTickets lista os tickets de um cliente logado.
func ListClientTickets(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}

	iter := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("tickets").OrderBy("createdAt", firestore.Desc).Documents(context.Background())
	docs, err := iter.GetAll()
	if err != nil {
		log.Printf("Erro ao listar tickets para o cliente %s: %v", userID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao buscar seus tickets.")
		return
	}

	tickets := make([]map[string]interface{}, 0, len(docs))
	for _, doc := range docs {
		tickets = append(tickets, doc.Data())
	}

	utils.Success(c, http.StatusOK, tickets)
}

// CreateClientTicket cria um novo ticket para o cliente logado.
func CreateClientTicket(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}
	userName, _ := sess.Values["email"].(string)

	var p models.Ticket
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	newTicketRef := firebase.FirestoreClient.Collection("tickets").NewDoc()

	p.ID = newTicketRef.ID
	p.ClientID = userID
	p.ClientName = userName
	p.Status = constants.StatusOpen
	p.CreatedAt = time.Now()
	p.LastUpdated = time.Now()

	batch := firebase.FirestoreClient.Batch()

	// Escreve na coleção raiz de tickets para admin
	batch.Set(newTicketRef, p)

	// Escreve na subcoleção do cliente
	clientTicketRef := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("tickets").Doc(newTicketRef.ID)
	batch.Set(clientTicketRef, p)

	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao criar ticket para o cliente %s: %v", userID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar o ticket.")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Ticket criado com sucesso.", "ticketId": newTicketRef.ID})
}

// ReplyClientTicket adiciona uma resposta do cliente a um ticket.
func ReplyClientTicket(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}
	userName, _ := sess.Values["email"].(string)
	ticketID := c.Param("id")

	var p models.TicketReply
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	p.AuthorID = userID
	p.AuthorName = userName
	p.CreatedAt = time.Now()

	// Adiciona a resposta e atualiza o timestamp do ticket
	batch := firebase.FirestoreClient.Batch()

	// Adiciona resposta na coleção raiz
	rootReplyRef := firebase.FirestoreClient.Collection("tickets").Doc(ticketID).Collection("replies").NewDoc()
	batch.Set(rootReplyRef, p)
	// Adiciona resposta na subcoleção do cliente
	clientReplyRef := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("tickets").Doc(ticketID).Collection("replies").NewDoc()
	batch.Set(clientReplyRef, p)

	// Atualiza o timestamp do ticket em ambos os locais
	updateTime := map[string]interface{}{"lastUpdated": p.CreatedAt}
	batch.Set(firebase.FirestoreClient.Collection("tickets").Doc(ticketID), updateTime, firestore.MergeAll)
	batch.Set(firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("tickets").Doc(ticketID), updateTime, firestore.MergeAll)


	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao adicionar resposta ao ticket %s pelo cliente %s: %v", ticketID, userID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao enviar resposta.")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Resposta enviada com sucesso."})
}


// --- Handlers de Admin ---

// ListTickets lista todos os tickets do sistema. (Admin)
func ListTickets(c *gin.Context) {
	iter := firebase.FirestoreClient.Collection("tickets").OrderBy("lastUpdated", firestore.Desc).Documents(context.Background())
	docs, err := iter.GetAll()
	if err != nil {
		log.Printf("Erro ao listar todos os tickets (admin): %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao buscar a lista de tickets.")
		return
	}

	tickets := make([]map[string]interface{}, 0, len(docs))
	for _, doc := range docs {
		tickets = append(tickets, doc.Data())
	}

	utils.Success(c, http.StatusOK, tickets)
}

// ReplyToTicket adiciona uma resposta do admin a um ticket. (Admin)
func ReplyToTicket(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	adminID, ok := sess.Values["userID"].(string)
	if !ok || adminID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão de admin inválida.")
		return
	}
	adminName, _ := sess.Values["email"].(string)
	ticketID := c.Param("id")

	var p models.TicketReply
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}
	p.AuthorID = adminID
	p.AuthorName = fmt.Sprintf("%s (Suporte)", adminName)
	p.CreatedAt = time.Now()


	// Precisa descobrir a qual cliente o ticket pertence para escrever na subcoleção dele
	ticketDoc, err := firebase.FirestoreClient.Collection("tickets").Doc(ticketID).Get(context.Background())
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Ticket não encontrado.")
		return
	}
	clientID := ticketDoc.Data()["clientId"].(string)

	batch := firebase.FirestoreClient.Batch()

	rootReplyRef := firebase.FirestoreClient.Collection("tickets").Doc(ticketID).Collection("replies").NewDoc()
	batch.Set(rootReplyRef, p)
	clientReplyRef := firebase.FirestoreClient.Collection("clients").Doc(clientID).Collection("tickets").Doc(ticketID).Collection("replies").NewDoc()
	batch.Set(clientReplyRef, p)

	updateTime := map[string]interface{}{"lastUpdated": p.CreatedAt}
	batch.Set(firebase.FirestoreClient.Collection("tickets").Doc(ticketID), updateTime, firestore.MergeAll)
	batch.Set(firebase.FirestoreClient.Collection("clients").Doc(clientID).Collection("tickets").Doc(ticketID), updateTime, firestore.MergeAll)


	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao adicionar resposta ao ticket %s pelo admin %s: %v", ticketID, adminID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao enviar resposta.")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Resposta enviada com sucesso."})
}

// UpdateTicketStatus altera o status de um ticket. (Admin)
func UpdateTicketStatus(c *gin.Context) {
	ticketID := c.Param("id")

	var payload struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido, 'status' é obrigatório.")
		return
	}

	ticketDoc, err := firebase.FirestoreClient.Collection("tickets").Doc(ticketID).Get(context.Background())
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Ticket não encontrado.")
		return
	}
	clientID := ticketDoc.Data()["clientId"].(string)

	updateData := map[string]interface{}{
		"status": payload.Status,
		"lastUpdated": time.Now(),
	}

	batch := firebase.FirestoreClient.Batch()
	batch.Set(firebase.FirestoreClient.Collection("tickets").Doc(ticketID), updateData, firestore.MergeAll)
	batch.Set(firebase.FirestoreClient.Collection("clients").Doc(clientID).Collection("tickets").Doc(ticketID), updateData, firestore.MergeAll)

	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao atualizar status do ticket %s: %v", ticketID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao atualizar status do ticket.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Status do ticket atualizado com sucesso."})
}
