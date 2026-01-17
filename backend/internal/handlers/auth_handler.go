package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"backend/internal/domain/constants"
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
// Esta função agora também cria o documento na coleção `clients`.
func ensureUserAndRole(ctx context.Context, fs *firestore.Client, user *auth.UserRecord, firstName, lastName string) (string, error) {
	userRef := fs.Collection("users").Doc(user.UID)
	doc, err := userRef.Get(ctx)

	// Se o usuário já existe no Firestore, apenas retorna o papel dele
	if err == nil && doc.Exists() {
		role, _ := doc.Data()["role"].(string)
		return role, nil
	}

	// Se o documento do usuário não existe, vamos criá-lo em uma transação
	var role = "client" // Papel padrão

	err = fs.RunTransaction(ctx, func(ctx context.Context, tx *firestore.Transaction) error {
		// Contar quantos administradores existem para determinar se este deve ser o primeiro.
		adminQuery := fs.Collection("users").Where("role", "==", "admin").Limit(1)
		docs, err := tx.Documents(adminQuery).GetAll()
		if err != nil {
			return fmt.Errorf("falha ao verificar por admins existentes: %w", err)
		}

		if len(docs) == 0 {
			role = "admin"
			log.Printf("Nenhum administrador encontrado. Promovendo o usuário %s para admin.", user.Email)
		}

		// Cria o documento do usuário na coleção `users`
		newUser := models.User{
			ID:        user.UID,
			Email:     user.Email,
			FirstName: firstName,
			LastName:  lastName,
			Role:      role,
			CreatedAt: time.Now(),
		}
		if err := tx.Set(userRef, newUser); err != nil {
			return fmt.Errorf("falha ao criar documento do usuário: %w", err)
		}

		// Cria o documento do cliente na coleção `clients` para consistência
		clientRef := fs.Collection("clients").Doc(user.UID)
		clientData := map[string]interface{}{
			"id":          user.UID,
			"firstName":   firstName,
			"lastName":    lastName,
			"email":       user.Email,
			"createdAt":   time.Now().Format(time.RFC3339),
			"status":      constants.StatusActive,
			"phoneNumber": user.PhoneNumber, // usa o do auth se disponível
			"address":     "", // Endereço pode ser preenchido depois
		}
		return tx.Set(clientRef, clientData)
	})

	if err != nil {
		log.Printf("Erro na transação para criar usuário e cliente para UID %s: %v", user.UID, err)
		return "", err
	}

	log.Printf("Usuário %s (UID: %s) criado/verificado no Firestore com o papel: %s", user.Email, user.UID, role)
	return role, nil
}


// A função de registro foi removida pois o cadastro agora é feito no frontend
// e a sincronização ocorre no login.


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

    // Extrai nome e sobrenome do DisplayName
	displayName := userRecord.DisplayName
    parts := strings.SplitN(displayName, " ", 2)
    firstName := ""
    lastName := ""
    if len(parts) > 0 {
        firstName = parts[0]
    }
    if len(parts) > 1 {
        lastName = parts[1]
    }

	// Garante que o usuário exista no Firestore (cria se for a primeira vez) e obtém seu papel.
	// Esta é a função crítica para o bootstrap do admin.
	role, err := ensureUserAndRole(context.Background(), firebase.FirestoreClient, userRecord, firstName, lastName)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Falha ao processar os dados do usuário.")
		return
	}
    
    // Força a promoção se este usuário estiver configurado como o admin inicial no ambiente.
    // Isso garante que o admin correto tenha acesso, mesmo que não tenha sido o primeiro a se registrar.
    initialAdminEmail := os.Getenv("DRESBACH_INITIAL_ADMIN")
    if initialAdminEmail != "" && userRecord.Email == initialAdminEmail && role != "admin" {
        log.Printf("Usuário %s corresponde ao admin inicial designado. Promovendo para 'admin'.", userRecord.Email)
        role = "admin" // Override the role for the rest of this function
    }
    
    // Garante que o custom claim de role está definido no Auth, especialmente se foi alterado acima.
    if userRecord.CustomClaims == nil || userRecord.CustomClaims["role"] != role {
		log.Printf("Custom claim 'role' ausente ou diferente para o usuário %s. Atualizando de '%v' para '%s'.", userRecord.Email, userRecord.CustomClaims["role"], role)
        claims := map[string]interface{}{"role": role}
	    err = firebase.AuthClient.SetCustomUserClaims(context.Background(), userRecord.UID, claims)
	    if err != nil {
		    log.Printf("AVISO: Erro ao definir custom claims para UID %s: %v", userRecord.UID, err)
		    // Não é um erro fatal para o login, mas deve ser logado. O middleware de RBAC pode falhar na próxima requisição.
	    }
        // Se a role foi alterada, também a persistimos no Firestore.
        if role == "admin" {
            userRef := firebase.FirestoreClient.Collection("users").Doc(userRecord.UID)
	        _, err = userRef.Set(context.Background(), map[string]interface{}{"role": "admin"}, firestore.MergeAll)
            if err != nil {
                log.Printf("AVISO: Falha ao persistir a promoção para admin no Firestore para %s: %v", userRecord.Email, err)
            }
        }
    }


	isAdmin := role == "admin"

	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Values["userID"] = userRecord.UID
	sess.Values["email"] = userRecord.Email
	sess.Values["role"] = role
	sess.Values["isAdmin"] = isAdmin // Manter para compatibilidade, mas o 'role' é o principal
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
