package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"backend/internal/firebase"
	"backend/internal/session"
	"backend/internal/utils"

	recaptcha "cloud.google.com/go/recaptchaenterprise/v2"
	recaptchapb "cloud.google.com/go/recaptchaenterprise/v2/apiv1/recaptchaenterprisepb"

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

type LoginPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type VerifyTokenPayload struct {
	RecaptchaToken string `json:"recaptchaToken" binding:"required"`
}

// RegisterHandler lida com o registro de novos usuários.
// Ele cria o usuário no Firebase Auth e o documento de cliente no Firestore.
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

	// 2. Criar documento do cliente no Firestore
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

// LoginHandler lida com o login e criação de sessão.
func LoginHandler(c *gin.Context) {
	var p LoginPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	// NOTA DE SEGURANÇA: Este fluxo de login é inseguro e apenas para fins de exercício.
	// Uma aplicação de produção deve usar o Firebase Client SDK para logar o usuário,
	// obter o ID Token e enviá-lo para este backend para validação e criação de sessão.
	userRecord, err := firebase.AuthClient.GetUserByEmail(context.Background(), p.Email)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "Email ou senha inválidos")
		return
	}

	// Verifica se o usuário tem a claim de admin
	isAdmin := false
	if claims := userRecord.CustomClaims; claims != nil {
		if val, ok := claims["admin"]; ok {
			isAdmin = val.(bool)
		}
	}

	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Values["userID"] = userRecord.UID
	sess.Values["email"] = userRecord.Email
	sess.Values["isAdmin"] = isAdmin // Salva a permissão na sessão
	sess.Options.MaxAge = 86400      // 24 horas
	sess.Options.HttpOnly = true
	sess.Options.SameSite = http.SameSiteLaxMode

	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao salvar a sessão: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar a sessão")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Login bem-sucedido", "isAdmin": isAdmin})
}

// LogoutHandler lida com a destruição da sessão.
func LogoutHandler(c *gin.Context) {
	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Options.MaxAge = -1 // Expira o cookie
	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao destruir a sessão: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao fazer logout")
		return
	}
	utils.Success(c, http.StatusOK, gin.H{"message": "Logout bem-sucedido"})
}

// VerifyTokenHandler valida um token reCAPTCHA.
func VerifyTokenHandler(c *gin.Context) {
	var p VerifyTokenPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	recaptchaSiteKey := os.Getenv("RECAPTCHA_SITE_KEY")

	if projectID == "" || recaptchaSiteKey == "" || p.RecaptchaToken == "" {
		log.Println("Aviso: Faltando projectID, siteKey ou token para validação reCAPTCHA")
		utils.Error(c, http.StatusBadRequest, "Informação faltando para validação reCAPTCHA")
		return
	}

	isValid, err := createAssessment(projectID, recaptchaSiteKey, p.RecaptchaToken, "LOGIN")
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, "Erro durante a validação reCAPTCHA")
		return
	}
	if !isValid {
		utils.Error(c, http.StatusUnauthorized, "Validação reCAPTCHA falhou. Tente novamente.")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"success": true})
}

// createAssessment é uma função helper para a API reCAPTCHA.
func createAssessment(projectID string, recaptchaKey string, token string, recaptchaAction string) (bool, error) {
	ctx := context.Background()
	client, err := recaptcha.NewClient(ctx)
	if err != nil {
		log.Printf("Erro ao criar cliente reCAPTCHA: %v", err)
		return false, fmt.Errorf("não foi possível criar o cliente recaptcha")
	}
	defer client.Close()

	request := &recaptchapb.CreateAssessmentRequest{
		Assessment: &recaptchapb.Assessment{
			Event: &recaptchapb.Event{
				Token:   token,
				SiteKey: recaptchaKey,
			},
		},
		Parent: fmt.Sprintf("projects/%s", projectID),
	}

	response, err := client.CreateAssessment(ctx, request)
	if err != nil {
		log.Printf("Erro ao chamar CreateAssessment: %v", err)
		return false, fmt.Errorf("não foi possível criar a avaliação")
	}

	if !response.TokenProperties.Valid {
		log.Printf("A chamada CreateAssessment() falhou porque o token era inválido: %v", response.TokenProperties.InvalidReason)
		return false, nil
	}

	if response.TokenProperties.Action != recaptchaAction {
		log.Printf("O atributo de ação na sua tag reCAPTCHA não corresponde à ação que você espera pontuar")
		return false, nil
	}

	log.Printf("A pontuação reCAPTCHA para este token é: %v", response.RiskAnalysis.Score)
	if response.RiskAnalysis.Score < 0.5 {
		log.Printf("Pontuação reCAPTCHA baixa: %v", response.RiskAnalysis.Score)
		return false, nil
	}

	return true, nil
}
