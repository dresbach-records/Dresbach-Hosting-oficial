package handlers

import (
	"net/http"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// ListProducts lista todos os produtos/planos. (Admin)
func ListProducts(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// CreateProduct cria um novo produto/plano. (Admin)
func CreateProduct(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// UpdateProduct atualiza um produto/plano. (Admin)
func UpdateProduct(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
