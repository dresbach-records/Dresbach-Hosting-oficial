package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

// Payloads para Bind de JSON
type RegisterPayload struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type SessionLoginPayload struct {
	IdToken string `json:"idToken" binding:"required"`
}

// RegisterHandler lida com o registro de novos usuários.
// Ele cria o usuário no Firebase Auth, o documento de cliente no Firestore,
// e promove o primeiro usuário registrado a administrador.
func RegisterHandler(c *gin.Context) {
	var p RegisterPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	if !strings.Contains(p.Email, "@") {
		utils.Error(c, http.StatusBadRequest, "Formato de email inválido")
		return
	}
	if len(p.Password) < 6 {
		utils.Error(c, http.StatusBadRequest, "A senha deve ter pelo menos 6 caracteres")
		return
	}

	// 1. Criar usuário no Firebase Authentication
	params := (&auth.UserToCreate{}).
		Email(p.Email).
		Password(p.Password).
		DisplayName(fmt.Sprintf("%s %s", p.FirstName, p.LastName)).
		EmailVerified(false).
		Disabled(false)

	userRecord, err := firebase.AuthClient.CreateUser(context.Background(), params)
	if err != nil {
		if auth.IsEmailAlreadyExists(err) {
			utils.Error(c, http.StatusConflict, "O email já está em uso")
			return
		}
		log.Printf("Erro ao criar usuário no Auth: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar o usuário no sistema de autenticação")
		return
	}

	// 2. Verificar se é o primeiro usuário para promover a admin
	isFirstUser := false
	iter := firebase.FirestoreClient.Collection("clients").Limit(1).Documents(context.Background())
	docs, err := iter.GetAll()
	if err != nil {
		// Loga o erro mas continua, pois a criação do usuário é mais crítica.
		log.Printf("AVISO: Não foi possível verificar se existem outros clientes. O usuário %s não será promovido a admin automaticamente: %v", p.Email, err)
	} else if len(docs) == 0 {
		isFirstUser = true
	}

	if isFirstUser {
		claims := map[string]interface{}{"admin": true}
		err = firebase.AuthClient.SetCustomUserClaims(context.Background(), userRecord.UID, claims)
		if err != nil {
			// Novamente, loga o erro mas não impede o registro do usuário
			log.Printf("AVISO: Falha ao definir a claim de admin para o primeiro usuário %s: %v", userRecord.UID, err)
		} else {
			log.Printf("Este é o primeiro usuário registrado. %s foi promovido a administrador.", p.Email)
		}
	}


	// 3. Criar documento do cliente no Firestore
	clientData := map[string]interface{}{
		"id":          userRecord.UID,
		"firstName":   p.FirstName,
		"lastName":    p.LastName,
		"email":       p.Email,
		"createdAt":   time.Now().Format(time.RFC3339),
		"status":      "Ativo",
		"phoneNumber": "",
		"address":     "",
	}

	_, err = firebase.FirestoreClient.Collection("clients").Doc(userRecord.UID).Set(context.Background(), clientData)
	if err != nil {
		log.Printf("Erro ao criar documento do cliente no Firestore para UID %s: %v", userRecord.UID, err)
		// Em um cenário de produção, seria ideal deletar o usuário do Auth para manter a consistência.
		// Ex: firebase.AuthClient.DeleteUser(context.Background(), userRecord.UID)
		utils.Error(c, http.StatusInternalServerError, "Falha ao salvar os dados do cliente após a criação do usuário")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Usuário criado com sucesso", "userId": userRecord.UID})
}

// SessionLoginHandler verifica um Firebase ID token e cria uma sessão cookie. Este é o método de login seguro preferencial.
func SessionLoginHandler(c *gin.Context) {
	var p SessionLoginPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: o token de ID é obrigatório.")
		return
	}

	token, err := firebase.AuthClient.VerifyIDToken(context.Background(), p.IdToken)
	if err != nil {
		log.Printf("Erro ao verificar o ID Token: %v", err)
		utils.Error(c, http.StatusUnauthorized, "Token de autenticação inválido ou expirado.")
		return
	}

	userRecord, err := firebase.AuthClient.GetUser(context.Background(), token.UID)
	if err != nil {
		log.Printf("Erro ao obter registro do usuário para UID %s: %v", token.UID, err)
		utils.Error(c, http.StatusInternalServerError, "Não foi possível obter os dados do usuário.")
		return
	}

	isAdmin := false
	if claims := userRecord.CustomClaims; claims != nil {
		if val, ok := claims["admin"]; ok {
			isAdmin, _ = val.(bool)
		}
	}

	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Values["userID"] = userRecord.UID
	sess.Values["email"] = userRecord.Email
	sess.Values["isAdmin"] = isAdmin
	sess.Options.MaxAge = 86400 * 3 // 3 dias
	sess.Options.HttpOnly = true
	sess.Options.SameSite = http.SameSiteLaxMode

	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao salvar a sessão: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar a sessão")
		return
	}

	log.Printf("Sessão criada com sucesso para %s (Admin: %t)", userRecord.Email, isAdmin)
	utils.Success(c, http.StatusOK, gin.H{"message": "Sessão criada com sucesso", "isAdmin": isAdmin})
}

// LogoutHandler lida com a destruição da sessão.
func LogoutHandler(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	email, _ := sess.Values["email"].(string)

	sess.Options.MaxAge = -1 // Expira o cookie
	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao destruir a sessão para %s: %v\n", email, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao fazer logout")
		return
	}
	log.Printf("Logout bem-sucedido para %s", email)
	utils.Success(c, http.StatusOK, gin.H{"message": "Logout bem-sucedido"})
}
