package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"backend/internal/utils"
	"backend/internal/whm"

	"github.com/gin-gonic/gin"
)

type ProvisionPayload struct {
	Plan   string  `json:"plan" binding:"required"`
	Cycle  string  `json:"cycle" binding:"required"`
	Domain string  `json:"domain" binding:"required"`
	Price  float64 `json:"price"`
}

// generateUsername creates a cPanel username from a domain.
func generateUsername(domain string) string {
	// Remove TLD and special characters
	base := strings.Split(domain, ".")[0]
	base = strings.ReplaceAll(base, "-", "")
	base = strings.ReplaceAll(base, "_", "")
	// cPanel usernames have a max length of 16
	if len(base) > 16 {
		return base[:16]
	}
	return base
}

// generatePassword creates a random secure password.
func generatePassword(length int) string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	chars := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*")
	var b strings.Builder
	for i := 0; i < length; i++ {
		b.WriteRune(chars[r.Intn(len(chars))])
	}
	return b.String()
}

// ProvisionAccountHandler handles the account creation request from the frontend.
func ProvisionAccountHandler(c *gin.Context) {
	var p ProvisionPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	if whm.WhmClient == nil {
		log.Printf("Simulando provisionamento para o domínio %s (cliente WHM não configurado)", p.Domain)
		// Simulate a delay
		time.Sleep(2 * time.Second)
		utils.Success(c, http.StatusOK, gin.H{"message": "Conta provisionada com sucesso (simulação)."})
		return
	}

	username := generateUsername(p.Domain)
	password := generatePassword(16)
	// Map frontend plan name to WHM package name (this may need adjustment)
	// For now, let's assume a simple mapping. E.g., "Profissional" -> "dresbach_profissional"
	whmPlanName := "dresbach_" + strings.ToLower(p.Plan)

	log.Printf("Iniciando provisionamento WHM para domínio: %s, usuário: %s, plano: %s", p.Domain, username, whmPlanName)

	resp, err := whm.WhmClient.CreateAccount(p.Domain, username, password, whmPlanName)
	if err != nil {
		log.Printf("Erro ao chamar a API WHM: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		log.Printf("API WHM retornou status não-OK: %d. Resposta: %s", resp.StatusCode, string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "O servidor de hospedagem retornou um erro.")
		return
	}

	var whmResponse map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &whmResponse); err != nil {
		log.Printf("Erro ao decodificar resposta do WHM: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Resposta inválida do servidor de hospedagem.")
		return
	}

	// WHM API v1 returns metadata and data fields. result is in metadata.
	metadata, ok := whmResponse["metadata"].(map[string]interface{})
	if !ok {
		log.Printf("Resposta do WHM não contém 'metadata': %s", string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "Resposta inesperada do servidor de hospedagem.")
		return
	}

	result, ok := metadata["result"].(float64)
	if !ok || result != 1 {
		reason := "Razão desconhecida"
		if r, exists := metadata["reason"]; exists {
			reason = r.(string)
		}
		log.Printf("Falha na criação da conta WHM: %s", reason)
		utils.Error(c, http.StatusBadRequest, fmt.Sprintf("Não foi possível criar a conta: %s", reason))
		return
	}

	// TODO: Save the new service to Firestore here.

	log.Printf("Conta para %s criada com sucesso no WHM.", p.Domain)
	utils.Success(c, http.StatusOK, gin.H{
		"message": "Conta provisionada com sucesso!",
		"details": whmResponse,
	})
}
