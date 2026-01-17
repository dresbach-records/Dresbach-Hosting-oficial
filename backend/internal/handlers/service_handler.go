package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"backend/internal/domain/constants"
	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"
	"backend/internal/whm"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// --- Helpers ---

// updateServiceStatus atualiza o status de um serviço no documento raiz e na subcoleção do cliente.
func updateServiceStatus(ctx context.Context, serviceID, newStatus string) error {
	doc, err := firebase.FirestoreClient.Collection("services").Doc(serviceID).Get(ctx)
	if err != nil {
		return fmt.Errorf("serviço %s não encontrado na coleção raiz: %w", serviceID, err)
	}
	clientID, ok := doc.Data()["clientId"].(string)
	if !ok || clientID == "" {
		return fmt.Errorf("serviço %s não possui um clientId válido", serviceID)
	}

	batch := firebase.FirestoreClient.Batch()
	updateData := map[string]interface{}{"status": newStatus}

	rootRef := firebase.FirestoreClient.Collection("services").Doc(serviceID)
	batch.Update(rootRef, []firestore.Update{{Path: "status", Value: newStatus}})

	clientSubRef := firebase.FirestoreClient.Collection("clients").Doc(clientID).Collection("services").Doc(serviceID)
	batch.Update(clientSubRef, []firestore.Update{{Path: "status", Value: newStatus}})

	_, err = batch.Commit(ctx)
	return err
}

// --- Handlers da Área do Cliente ---

// ListClientServices lista os serviços de um cliente logado.
func ListClientServices(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}

	iter := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("services").Documents(context.Background())
	docs, err := iter.GetAll()
	if err != nil {
		log.Printf("Erro ao listar serviços para o cliente %s: %v", userID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao buscar seus serviços.")
		return
	}

	services := make([]map[string]interface{}, 0, len(docs))
	for _, doc := range docs {
		services = append(services, doc.Data())
	}

	utils.Success(c, http.StatusOK, services)
}

// GetClientService obtém um serviço específico de um cliente logado.
func GetClientService(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	userID, ok := sess.Values["userID"].(string)
	if !ok || userID == "" {
		utils.Error(c, http.StatusUnauthorized, "Sessão inválida.")
		return
	}

	serviceID := c.Param("id")
	if serviceID == "" {
		utils.Error(c, http.StatusBadRequest, "O ID do serviço é obrigatório.")
		return
	}

	doc, err := firebase.FirestoreClient.Collection("clients").Doc(userID).Collection("services").Doc(serviceID).Get(context.Background())
	if err != nil {
		log.Printf("Erro ao buscar serviço %s para o cliente %s: %v", serviceID, userID, err)
		utils.Error(c, http.StatusNotFound, "Serviço não encontrado ou você não tem permissão para acessá-lo.")
		return
	}

	utils.Success(c, http.StatusOK, doc.Data())
}


// --- Handlers de Admin ---

// ListServices lista todos os serviços do sistema. (Admin)
func ListServices(c *gin.Context) {
	iter := firebase.FirestoreClient.Collection("services").Documents(context.Background())
	docs, err := iter.GetAll()
	if err != nil {
		log.Printf("Erro ao listar todos os serviços (admin): %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao buscar a lista de serviços.")
		return
	}

	services := make([]map[string]interface{}, 0, len(docs))
	for _, doc := range docs {
		services = append(services, doc.Data())
	}

	utils.Success(c, http.StatusOK, services)
}

// SuspendService suspende um serviço. (Admin)
func SuspendService(c *gin.Context) {
	serviceID := c.Param("id")
	reason := "Suspended by admin" // Pode ser pego do corpo da requisição

	doc, err := firebase.FirestoreClient.Collection("services").Doc(serviceID).Get(context.Background())
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Serviço não encontrado.")
		return
	}
	cpanelUser, ok := doc.Data()["cpanelUser"].(string)
	if !ok || cpanelUser == "" {
		utils.Error(c, http.StatusInternalServerError, "Serviço não possui um usuário cPanel associado.")
		return
	}

	if whm.WhmClient != nil {
		resp, err := whm.WhmClient.SuspendAccount(cpanelUser, reason)
		if err != nil {
			log.Printf("Erro ao suspender conta %s no WHM: %v", cpanelUser, err)
			utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
			return
		}
		defer resp.Body.Close()
		// Analisar a resposta do WHM para garantir o sucesso
	} else {
		log.Printf("AVISO: Simulando suspensão da conta %s (cliente WHM não configurado)", cpanelUser)
	}

	if err := updateServiceStatus(context.Background(), serviceID, constants.StatusSuspended); err != nil {
		log.Printf("Erro ao atualizar status do serviço %s para '%s': %v", serviceID, constants.StatusSuspended, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao atualizar o status do serviço no banco de dados.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Serviço suspenso com sucesso."})
}

// UnsuspendService reativa um serviço. (Admin)
func UnsuspendService(c *gin.Context) {
	serviceID := c.Param("id")

	doc, err := firebase.FirestoreClient.Collection("services").Doc(serviceID).Get(context.Background())
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Serviço não encontrado.")
		return
	}
	cpanelUser, ok := doc.Data()["cpanelUser"].(string)
	if !ok || cpanelUser == "" {
		utils.Error(c, http.StatusInternalServerError, "Serviço não possui um usuário cPanel associado.")
		return
	}

	if whm.WhmClient != nil {
		resp, err := whm.WhmClient.UnsuspendAccount(cpanelUser)
		if err != nil {
			log.Printf("Erro ao reativar conta %s no WHM: %v", cpanelUser, err)
			utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
			return
		}
		defer resp.Body.Close()
		// Analisar a resposta do WHM para garantir o sucesso
	} else {
		log.Printf("AVISO: Simulando reativação da conta %s (cliente WHM não configurado)", cpanelUser)
	}

	if err := updateServiceStatus(context.Background(), serviceID, constants.StatusActive); err != nil {
		log.Printf("Erro ao atualizar status do serviço %s para '%s': %v", serviceID, constants.StatusActive, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao atualizar o status do serviço no banco de dados.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Serviço reativado com sucesso."})
}

// TerminateService encerra um serviço. (Admin)
func TerminateService(c *gin.Context) {
	serviceID := c.Param("id")

	doc, err := firebase.FirestoreClient.Collection("services").Doc(serviceID).Get(context.Background())
	if err != nil {
		utils.Error(c, http.StatusNotFound, "Serviço não encontrado.")
		return
	}
	data := doc.Data()
	cpanelUser, okUser := data["cpanelUser"].(string)
	clientID, okClient := data["clientId"].(string)

	if !okUser || cpanelUser == "" {
		utils.Error(c, http.StatusInternalServerError, "Serviço não possui um usuário cPanel associado.")
		return
	}
	if !okClient || clientID == "" {
		utils.Error(c, http.StatusInternalServerError, "Serviço não possui um cliente associado.")
		return
	}

	if whm.WhmClient != nil {
		resp, err := whm.WhmClient.RemoveAccount(cpanelUser, false)
		if err != nil {
			log.Printf("Erro ao remover conta %s no WHM: %v", cpanelUser, err)
			utils.Error(c, http.StatusInternalServerError, "Falha na comunicação com o servidor de hospedagem.")
			return
		}
		defer resp.Body.Close()

		bodyBytes, _ := io.ReadAll(resp.Body)
		var whmResponse map[string]interface{}
		if err := json.Unmarshal(bodyBytes, &whmResponse); err == nil {
			if metadata, ok := whmResponse["metadata"].(map[string]interface{}); ok {
				if metadata["result"].(float64) != 1 {
					log.Printf("Falha na remoção da conta WHM: %s", metadata["reason"].(string))
					// não retorna erro, pois ainda queremos remover do firestore
				}
			}
		}
	} else {
		log.Printf("AVISO: Simulando remoção da conta %s (cliente WHM não configurado)", cpanelUser)
	}

	// Deleta os documentos do Firestore
	batch := firebase.FirestoreClient.Batch()
	rootRef := firebase.FirestoreClient.Collection("services").Doc(serviceID)
	batch.Delete(rootRef)
	clientSubRef := firebase.FirestoreClient.Collection("clients").Doc(clientID).Collection("services").Doc(serviceID)
	batch.Delete(clientSubRef)

	if _, err := batch.Commit(context.Background()); err != nil {
		log.Printf("Erro ao deletar documentos do serviço %s: %v", serviceID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao remover o serviço do banco de dados.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Serviço encerrado e removido com sucesso."})
}
