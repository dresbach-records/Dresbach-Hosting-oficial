package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"backend/internal/firebase"
	"backend/internal/models"
	"backend/internal/session"
	"backend/internal/utils"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

type RegisterPayload struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type SessionLoginPayload struct {
	IdToken string `json:"idToken" binding:"required"`
}

// ensureUserAndRole verifica se um usuário existe no Firestore e o cria se necessário.
// Se for o primeiro usuário a se registrar, ele é promovido a 'admin'.
func ensureUserAndRole(ctx context.Context, fs *firestore.Client, user *auth.UserRecord, firstName, lastName string) (string, error) {
	userRef := fs.Collection("users").Doc(user.UID)
	doc, err := userRef.Get(ctx)

	// Usuário já existe, retorna o papel dele.
	if err == nil && doc.Exists() {
		role, _ := doc.Data()["role"].(string)
		return role, nil
	}

	// Usuário não existe, vamos criá-lo.
	var role = "client" // Papel padrão

	// Transação para garantir a atomicidade da verificação do primeiro admin.
	err = fs.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		// Contar quantos administradores existem.
		adminQuery := fs.Collection("users").Where("role", "==", "admin").Limit(1)
		docs, err := tx.Documents(adminQuery).GetAll()
		if err != nil {
			return err
		}

		// Se não houver administradores, este usuário se torna o primeiro.
		if len(docs) == 0 {
			role = "admin"
		}

		// Cria o novo documento de usuário dentro da transação.
		newUser := models.User{
			ID:        user.UID,
			Email:     user.Email,
			FirstName: firstName,
			LastName:  lastName,
			Role:      role,
			CreatedAt: time.Now(),
		}
		return tx.Set(userRef, newUser)
	})

	if err != nil {
		log.Printf("Erro na transação para criar usuário e definir papel para UID %s: %v", user.UID, err)
		return "", err
	}

	log.Printf("Usuário %s (UID: %s) criado no Firestore com o papel: %s", user.Email, user.UID, role)
	return role, nil
}


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

	// 2. Garantir que o usuário exista no Firestore e obter seu papel (com promoção para admin se for o primeiro)
	role, err := ensureUserAndRole(context.Background(), firebase.FirestoreClient, userRecord, p.FirstName, p.LastName)
	if err != nil {
		// Em um cenário de produção robusto, seria ideal deletar o usuário do Auth para manter a consistência.
		// firebase.AuthClient.DeleteUser(context.Background(), userRecord.UID)
		utils.Error(c, http.StatusInternalServerError, "Falha ao salvar os dados do usuário após a criação.")
		return
	}

	// 3. Atualizar as Custom Claims no Firebase Auth com o papel correto
	claims := map[string]interface{}{"role": role}
	err = firebase.AuthClient.SetCustomUserClaims(context.Background(), userRecord.UID, claims)
	if err != nil {
		log.Printf("Erro ao definir custom claims para UID %s: %v", userRecord.UID, err)
		// Isso não é um erro fatal para o registro, mas deve ser logado.
	}


	// 4. Criar documento do cliente na coleção `clients` para compatibilidade com o frontend
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
		utils.Error(c, http.StatusInternalServerError, "Falha ao salvar os dados do cliente após a criação do usuário")
		return
	}


	utils.Success(c, http.StatusCreated, gin.H{
		"message": "Usuário criado com sucesso", 
		"userId": userRecord.UID,
		"role": role,
	})
}


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

	// Garante que o usuário existe no Firestore e obtém seu papel.
	userRecord, err := firebase.AuthClient.GetUser(context.Background(), token.UID)
	if err != nil {
		log.Printf("Erro ao obter registro do usuário para UID %s: %v", token.UID, err)
		utils.Error(c, http.StatusInternalServerError, "Não foi possível obter os dados do usuário.")
		return
	}
	
	// A função ensureUserAndRole não é chamada aqui para evitar criar um usuário no login.
	// O usuário DEVE existir do registro. Vamos buscar o papel direto.
	userDoc, err := firebase.FirestoreClient.Collection("users").Doc(userRecord.UID).Get(context.Background())
	if err != nil {
		log.Printf("Usuário %s (UID: %s) autenticado mas não encontrado no Firestore. Forçando logout.", userRecord.Email, userRecord.UID)
		utils.Error(c, http.StatusForbidden, "Usuário não registrado no sistema. Contate o suporte.")
		return
	}
	
	role, _ := userDoc.Data()["role"].(string)
	isAdmin := role == "admin"


	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Values["userID"] = userRecord.UID
	sess.Values["email"] = userRecord.Email
	sess.Values["role"] = role
	sess.Values["isAdmin"] = isAdmin // Manter para compatibilidade com o middleware antigo
	sess.Options.MaxAge = 86400 * 3 // 3 dias
	sess.Options.HttpOnly = true
	sess.Options.SameSite = http.SameSiteLaxMode

	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao salvar a sessão: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar a sessão")
		return
	}

	log.Printf("Sessão criada com sucesso para %s (Role: %s)", userRecord.Email, role)
	utils.Success(c, http.StatusOK, gin.H{
		"message": "Sessão criada com sucesso", 
		"isAdmin": isAdmin,
		"role": role,
	})
}


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
