package handlers

import (
	"backend/internal/domain/constants"
	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"
	"backend/internal/whm"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// GetAdminDashboard retorna dados para o dashboard do admin.
func GetAdminDashboard(c *gin.Context) {
	ctx := context.Background()
	var wg sync.WaitGroup
	var mu sync.Mutex

	dashboardData := gin.H{
		"clients":            0,
		"services":           0,
		"invoices_open":      0,
		"tickets_open":       0,
		"revenue":            18970.50, // Placeholder
		"whm_total_accounts": 0,
	}

	// Função para obter contagem de uma coleção
	getCount := func(collectionName string, query firestore.Query, key string) {
		defer wg.Done()
		snap, err := query.NewAggregationQuery().WithCount("all").Get(ctx)
		if err != nil {
			log.Printf("Erro ao obter contagem para %s: %v", collectionName, err)
			return
		}
		count, ok := snap["all"]
		if !ok {
			log.Printf("Campo 'all' não encontrado na agregação para %s", collectionName)
			return
		}

		mu.Lock()
		dashboardData[key] = count.Value()
		mu.Unlock()
	}

	// Goroutine for WHM data
	getWhmCount := func() {
		defer wg.Done()
		if whm.WhmClient == nil {
			log.Println("Cliente WHM não configurado, pulando busca de contas.")
			return
		}

		resp, err := whm.WhmClient.ListAccounts()
		if err != nil {
			log.Printf("Erro ao buscar contas do WHM: %v", err)
			return
		}
		defer resp.Body.Close()

		bodyBytes, _ := io.ReadAll(resp.Body)
		var whmResponse map[string]interface{}
		if err := json.Unmarshal(bodyBytes, &whmResponse); err != nil {
			log.Printf("Erro ao decodificar resposta de lista de contas do WHM: %v", err)
			return
		}

		if data, ok := whmResponse["data"].(map[string]interface{}); ok {
			if acct, ok := data["acct"].([]interface{}); ok {
				mu.Lock()
				dashboardData["whm_total_accounts"] = len(acct)
				mu.Unlock()
			}
		}
	}

	wg.Add(5)
	go getCount("clients", firebase.FirestoreClient.Collection("clients"), "clients")
	go getCount("services", firebase.FirestoreClient.Collection("services").Where("status", "==", constants.StatusActive), "services")
	go getCount("invoices", firebase.FirestoreClient.Collection("invoices").Where("status", "!=", constants.StatusPaid), "invoices_open")
	go getCount("tickets", firebase.FirestoreClient.Collection("tickets").Where("status", "==", constants.StatusOpen), "tickets_open")
	go getWhmCount()

	wg.Wait()

	utils.Success(c, http.StatusOK, dashboardData)
}

// GetClientDashboard retorna dados para o dashboard do cliente.
func GetClientDashboard(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}

	ctx := context.Background()
	var wg sync.WaitGroup
	var mu sync.Mutex

	clientBase := firebase.FirestoreClient.Collection("clients").Doc(userID)
	dashboardData := gin.H{
		"services":      0,
		"domains":       0,
		"tickets_open":  0,
		"invoices_open": 0,
	}

	getCount := func(collectionName string, query firestore.Query, key string) {
		defer wg.Done()
		snap, err := query.NewAggregationQuery().WithCount("all").Get(ctx)
		if err != nil {
			log.Printf("Erro ao obter contagem para %s do cliente %s: %v", collectionName, userID, err)
			return
		}
		count, ok := snap["all"]
		if !ok {
			return
		}

		mu.Lock()
		dashboardData[key] = count.Value()
		mu.Unlock()
	}

	wg.Add(4)
	go getCount("services", clientBase.Collection("services"), "services")
	go getCount("domains", clientBase.Collection("domains"), "domains")
	go getCount("tickets", clientBase.Collection("tickets").Where("status", "==", constants.StatusOpen), "tickets_open")
	go getCount("invoices", clientBase.Collection("invoices").Where("status", "!=", constants.StatusPaid), "invoices_open")

	wg.Wait()

	utils.Success(c, http.StatusOK, dashboardData)
}
