package handlers

import (
	"net/http"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// GetAdminDashboard retorna dados para o dashboard do admin.
func GetAdminDashboard(c *gin.Context) {
	// Placeholder data
	dashboardData := gin.H{
		"clients": 124,
		"services": 310,
		"invoices_open": 18,
		"revenue": 18970.50,
	}
	utils.Success(c, http.StatusOK, dashboardData)
}

// GetClientDashboard retorna dados para o dashboard do cliente.
func GetClientDashboard(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
