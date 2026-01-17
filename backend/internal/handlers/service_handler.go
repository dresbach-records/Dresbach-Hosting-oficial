package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"
	"backend/internal/whm"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	// Obter o ID do usuário da sessão validada pelo middleware
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	clientName, _ := sess.Values["email"].(string) // Usar email como clientName
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão de usuário inválida ou não encontrada.")
		return
	}

	// Lógica de provisionamento WHM
	username := generateUsername(p.Domain)
	password := generatePassword(16)
	whmPlanName := "dresbach_" + strings.ToLower(p.Plan)

	log.Printf("Iniciando provisionamento para o usuário %s. Domínio: %s, Plano WHM: %s", userID, p.Domain, whmPlanName)

	if whm.WhmClient != nil {
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

		metadata, ok := whmResponse["metadata"].(map[string]interface{})
		if !ok || metadata["result"].(float64) != 1 {
			reason := metadata["reason"].(string)
			log.Printf("Falha na criação da conta WHM: %s", reason)
			utils.Error(c, http.StatusBadRequest, fmt.Sprintf("Não foi possível criar a conta: %s", reason))
			return
		}

		log.Printf("Conta para %s criada com sucesso no WHM.", p.Domain)
	} else {
		log.Printf("Simulando provisionamento para o domínio %s (cliente WHM não configurado)", p.Domain)
		time.Sleep(2 * time.Second) // Simula delay
	}

	// Salvar o novo serviço no Firestore
	serviceID := uuid.New().String()
	serviceData := map[string]interface{}{
		"id":          serviceID,
		"clientId":    userID,
		"clientName":  clientName,
		"serviceType": p.Plan,
		"description": fmt.Sprintf("Plano de Hospedagem %s para o domínio %s", p.Plan, p.Domain),
		"domain":      p.Domain,
		"startDate":   time.Now().Format(time.RFC3339),
		"status":      "Active",
	}

	batch := firebase.FirestoreClient.Batch()
	// Salva na subcoleção do cliente
	clientServiceRef := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("services").Doc(serviceID)
	batch.Set(clientServiceRef, serviceData)
	// Salva na coleção raiz para queries de admin
	rootServiceRef := firebase.FirestoreClient.Collection("services").Doc(serviceID)
	batch.Set(rootServiceRef, serviceData)

	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao salvar serviço no Firestore: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao registrar o novo serviço no sistema.")
		return
	}

	log.Printf("Serviço %s salvo com sucesso no Firestore para o cliente %s.", serviceID, userID)
	utils.Success(c, http.StatusOK, gin.H{
		"message": "Conta provisionada e registrada com sucesso!",
	})
}

// --- Handlers da Área do Cliente ---

// ListClientServices lista os serviços de um cliente logado.
func ListClientServices(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// GetClientService obtém um serviço específico de um cliente logado.
func GetClientService(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}


// --- Handlers de Admin ---

// ListServices lista todos os serviços do sistema. (Admin)
func ListServices(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// SuspendService suspende um serviço. (Admin)
func SuspendService(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// UnsuspendService reativa um serviço. (Admin)
func UnsuspendService(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}

// TerminateService encerra um serviço. (Admin)
func TerminateService(c *gin.Context) {
	utils.Error(c, http.StatusNotImplemented, "Handler não implementado")
}
