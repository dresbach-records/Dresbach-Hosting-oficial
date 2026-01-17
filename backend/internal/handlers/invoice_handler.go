package handlers

import (
	"net/http"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)


// --- Handlers da Área do Cliente ---

// ListClientInvoices lista as faturas de um cliente logado.
func ListClientInvoices(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// PayClientInvoice processa o pagamento de uma fatura de um cliente.
func PayClientInvoice(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}


// --- Handlers de Admin ---

// ListInvoices lista todas as faturas. (Admin)
func ListInvoices(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// CreateInvoice cria uma nova fatura. (Admin)
func CreateInvoice(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// MarkInvoiceAsPaid marca uma fatura como paga. (Admin)
func MarkInvoiceAsPaid(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
