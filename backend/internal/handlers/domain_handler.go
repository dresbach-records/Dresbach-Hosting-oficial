package handlers

import (
	"log"
	"net/http"

	"backend/internal/rdap"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// DomainLookupHandler checks the availability of a domain.
func DomainLookupHandler(c *gin.Context) {
	domain := c.Param("domain")
	if domain == "" {
		utils.Error(c, http.StatusBadRequest, "O nome de domínio é obrigatório")
		return
	}

	isAvailable, err := rdap.CheckAvailability(domain)
	if err != nil {
		log.Printf("Erro na consulta de domínio para %s: %v", domain, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao verificar o domínio.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{
		"domain":    domain,
		"available": isAvailable,
	})
}
