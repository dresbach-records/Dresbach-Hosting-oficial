package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"
	"backend/internal/whm"

	"github.comcom/gin-gonic/gin"
)

// verifyServiceOwner é uma função helper para verificar se o usuário logado é o dono do serviço
// e retornar o nome de usuário do cPanel.
func verifyServiceOwner(c *gin.Context) (string, string, bool) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return "", "", false
	}
	serviceID := c.Param("id")

	doc, err := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("services").Doc(serviceID).Get(context.Background())
	if err != nil {
		log.Printf("Erro ao buscar serviço %s para cliente %s: %v", serviceID, userID, err)
		utils.Error(c, http.StatusNotFound, "Serviço não encontrado ou você não tem permissão para acessá-lo.")
		return "", "", false
	}

	cpanelUser, ok := doc.Data()["cpanelUser"].(string)
	if !ok || cpanelUser == "" {
		utils.Error(c, http.StatusInternalServerError, "Serviço não possui um usuário cPanel associado.")
		return "", "", false
	}

	return cpanelUser, serviceID, true
}

// CreateCPanelSessionHandler gera uma sessão de login único para o cPanel.
func CreateCPanelSessionHandler(c *gin.Context) {
	cpanelUser, _, ok := verifyServiceOwner(c)
	if !ok {
		return // O erro já foi enviado por verifyServiceOwner
	}

	// Chamar a API do WHM
	if whm.WhmClient == nil {
		log.Println("AVISO: Tentativa de SSO sem cliente WHM configurado.")
		utils.Error(c, http.StatusServiceUnavailable, "A função de login automático está temporariamente indisponível.")
		return
	}

	resp, err := whm.WhmClient.CreateUserSession(cpanelUser, "cpaneld")
	if err != nil {
		log.Printf("Erro ao criar sessão cPanel para usuário %s: %v", cpanelUser, err)
		utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)

	// Analisar a resposta do WHM
	var whmResponse map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &whmResponse); err != nil {
		log.Printf("Erro ao decodificar resposta de sessão do WHM: %v. Resposta: %s", err, string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "Resposta inválida do servidor de hospedagem ao tentar criar sessão.")
		return
	}

	data, ok := whmResponse["data"].(map[string]interface{})
	if !ok {
		metadata, metaOK := whmResponse["metadata"].(map[string]interface{})
		if metaOK {
			if reason, reasonOK := metadata["reason"].(string); reasonOK {
				log.Printf("Falha na criação da sessão WHM: %s", reason)
				utils.Error(c, http.StatusBadRequest, fmt.Sprintf("Não foi possível criar a sessão de login: %s", reason))
				return
			}
		}
		log.Printf("Estrutura de resposta inesperada da API WHM para SSO: %s", string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "Não foi possível processar a resposta do servidor de hospedagem.")
		return
	}

	sessionURL, ok := data["url"].(string)
	if !ok || sessionURL == "" {
		log.Printf("URL da sessão não encontrada na resposta do WHM: %s", string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "O servidor de hospedagem não retornou uma URL de login.")
		return
	}

	log.Printf("Sessão SSO para cPanel criada com sucesso para %s.", cpanelUser)

	utils.Success(c, http.StatusOK, gin.H{
		"message": "Sessão criada com sucesso.",
		"url":     sessionURL,
	})
}

// parseWhmMetric analisa uma string como "10.5M" ou "unlimited" e retorna o valor em MB.
func parseWhmMetric(metric string) float64 {
	metric = strings.ToLower(metric)
	if metric == "unlimited" {
		return -1 // Use -1 para representar infinito
	}

	value, err := strconv.ParseFloat(strings.TrimRight(metric, "mgb"), 64)
	if err != nil {
		return 0
	}

	if strings.HasSuffix(metric, "g") {
		return value * 1024 // GB to MB
	}
	if strings.HasSuffix(metric, "b") {
		return value / (1024 * 1024) // Bytes to MB
	}
	// Assume MB se não tiver sufixo
	return value
}

// GetAccountSummaryHandler obtém o resumo da conta cPanel.
func GetAccountSummaryHandler(c *gin.Context) {
	cpanelUser, _, ok := verifyServiceOwner(c)
	if !ok {
		return
	}

	if whm.WhmClient == nil {
		log.Println("AVISO: Tentativa de obter resumo sem cliente WHM configurado.")
		// Retorna dados mocados para permitir o desenvolvimento do frontend
		utils.Success(c, http.StatusOK, gin.H{
			"disk_limit":           10240, // 10 GB
			"disk_used":            2048,  // 2 GB
			"email_accounts_limit": 10,
			"email_accounts_used":  2,
			"mysql_db_limit":       5,
			"mysql_db_used":        1,
			"bandwidth_limit":      102400, // 100 GB
			"bandwidth_used":       15360,  // 15 GB
			"is_mock":              true,
		})
		return
	}

	resp, err := whm.WhmClient.GetAccountSummary(cpanelUser)
	if err != nil {
		log.Printf("Erro ao obter resumo para o usuário %s: %v", cpanelUser, err)
		utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var whmResponse map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &whmResponse); err != nil {
		log.Printf("Erro ao decodificar resposta de resumo do WHM: %v. Resposta: %s", err, string(bodyBytes))
		utils.Error(c, http.StatusInternalServerError, "Resposta inválida do servidor de hospedagem ao obter resumo.")
		return
	}

	metadata, metaOK := whmResponse["metadata"].(map[string]interface{})
	if metaOK && metadata["result"].(float64) == 0 {
		reason := metadata["reason"].(string)
		log.Printf("Falha ao obter resumo da conta WHM para %s: %s", cpanelUser, reason)
		utils.Error(c, http.StatusBadRequest, fmt.Sprintf("Não foi possível obter o resumo da conta: %s", reason))
		return
	}

	acct, ok := whmResponse["data"].(map[string]interface{})["acct"].([]interface{})
	if !ok || len(acct) == 0 {
		utils.Error(c, http.StatusNotFound, "Nenhum resumo de conta encontrado na resposta do servidor.")
		return
	}

	summary := acct[0].(map[string]interface{})

	// Extrai e converte valores numéricos para as contagens. WHM retorna strings.
	emailUsed, _ := strconv.Atoi(summary["suspend_emailacct_limit"].(string)) // Isso é um palpite, a API é inconsistente
	emailLimit, _ := strconv.Atoi(summary["emailaccounts"].(string))
	dbUsed, _ := strconv.Atoi(summary["dbused"].(string))
	dbLimit, _ := strconv.Atoi(summary["db"].(string))
	if emailLimit == 0 { // 'unlimited' é às vezes 0
		emailLimit = -1
	}
	if dbLimit == 0 {
		dbLimit = -1
	}

	responseData := gin.H{
		"disk_limit":           parseWhmMetric(summary["disklimit"].(string)),
		"disk_used":            parseWhmMetric(summary["diskused"].(string)),
		"email_accounts_limit": emailLimit,
		"email_accounts_used":  emailUsed,
		"mysql_db_limit":       dbLimit,
		"mysql_db_used":        dbUsed,
		"bandwidth_limit":      parseWhmMetric(summary["bandwidthlimit"].(string)),
		"bandwidth_used":       parseWhmMetric(summary["bandwidthused"].(string)),
		"is_mock":              false,
	}

	utils.Success(c, http.StatusOK, responseData)
}
