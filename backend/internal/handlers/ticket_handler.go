package handlers

import (
	"net/http"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)


// --- Handlers da Área do Cliente ---

// ListClientTickets lista os tickets de um cliente logado.
func ListClientTickets(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// CreateClientTicket cria um novo ticket para o cliente logado.
func CreateClientTicket(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// ReplyClientTicket adiciona uma resposta do cliente a um ticket.
func ReplyClientTicket(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}


// --- Handlers de Admin ---

// ListTickets lista todos os tickets do sistema. (Admin)
func ListTickets(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// ReplyToTicket adiciona uma resposta do admin a um ticket. (Admin)
func ReplyToTicket(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// UpdateTicketStatus altera o status de um ticket. (Admin)
func UpdateTicketStatus(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
