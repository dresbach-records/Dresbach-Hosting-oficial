package handlers

import (
	"net/http"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// ListServers lista todos os servidores WHM configurados. (Admin)
func ListServers(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// CreateServer adiciona um novo servidor WHM ao sistema. (Admin)
func CreateServer(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
