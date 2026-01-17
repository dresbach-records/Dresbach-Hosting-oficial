package models

import "time"

// User representa a estrutura de um usuário no sistema, armazenado na coleção 'users'.
// Este modelo é central para o sistema de autenticação e RBAC.
type User struct {
	ID        string    `firestore:"id"`
	Email     string    `firestore:"email"`
	FirstName string    `firestore:"firstName"`
	LastName  string    `firestore:"lastName"`
	Role      string    `firestore:"role"` // Ex: "admin", "staff", "client"
	CreatedAt time.Time `firestore:"createdAt"`
}

// Role representa um papel no sistema, com um conjunto de permissões.
// Armazenado na coleção 'roles'.
type Role struct {
	Name        string   `firestore:"name"`
	Permissions []string `firestore:"permissions"` // Ex: ["clients.read", "services.write"]
}


// Ticket representa a estrutura de um ticket de suporte.
type Ticket struct {
	ID             string    `json:"id" firestore:"id"`
	ClientID       string    `json:"clientId" firestore:"clientId"`
	ClientName     string    `json:"clientName" firestore:"clientName"`
	Subject        string    `json:"subject" firestore:"subject" binding:"required"`
	Department     string    `json:"department" firestore:"department" binding:"required"`
	RelatedService string    `json:"relatedService" firestore:"relatedService"`
	Priority       string    `json:"priority" firestore:"priority" binding:"required"`
	Status         string    `json:"status" firestore:"status"`
	CreatedAt      time.Time `json:"createdAt" firestore:"createdAt"`
	LastUpdated    time.Time `json:"lastUpdated" firestore:"lastUpdated"`
	Description    string    `json:"description" firestore:"description" binding:"required"`
}

// TicketReply representa uma resposta dentro de um ticket.
type TicketReply struct {
	AuthorID   string    `json:"authorId" firestore:"authorId"`
	AuthorName string    `json:"authorName" firestore:"authorName"`
	Message    string    `json:"message" firestore:"message" binding:"required"`
	CreatedAt  time.Time `json:"createdAt" firestore:"createdAt"`
}
