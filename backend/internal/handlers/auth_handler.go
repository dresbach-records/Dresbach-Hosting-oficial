package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type VerifyTokenPayload struct {
	RecaptchaToken string `json:"recaptchaToken" binding:"required"`
}

type MakeAdminPayload struct {
	Email string `json:"email" binding:"required"`
}

// RegisterHandler lida com o registro de novos usuários.
func RegisterHandler(c *gin.Context) {
	var p RegisterPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido")
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

	params := (&auth.UserToCreate{}).
		Email(p.Email).
		Password(p.Password).
		EmailVerified(false).
		Disabled(false)

	_, err := firebase.AuthClient.CreateUser(context.Background(), params)
	if err != nil {
		if auth.IsEmailAlreadyExists(err) {
			utils.Error(c, http.StatusConflict, "O email já está em uso")
			return
		}
		log.Printf("Erro ao criar usuário: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar usuário")
		return
	}

	utils.Success(c, http.StatusCreated, gin.H{"message": "Usuário criado com sucesso"})
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

	sess, _ := session.Store.Get(c.Request, session.Name)
	sess.Values["userID"] = userRecord.UID
	sess.Values["email"] = userRecord.Email
	sess.Options.MaxAge = 86400 // 24 horas
	sess.Options.HttpOnly = true
	sess.Options.SameSite = http.SameSiteLaxMode

	if err := sess.Save(c.Request, c.Writer); err != nil {
		log.Printf("Erro ao salvar a sessão: %v\n", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar a sessão")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": "Login bem-sucedido"})
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

// MakeAdminHandler atribui a claim de administrador a um usuário.
func MakeAdminHandler(c *gin.Context) {
	var p MakeAdminPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido")
		return
	}

	user, err := firebase.AuthClient.GetUserByEmail(context.Background(), p.Email)
	if err != nil {
		log.Printf("Erro ao obter usuário por email '%s': %v", p.Email, err)
		utils.Error(c, http.StatusNotFound, "Usuário não encontrado")
		return
	}

	claims := user.CustomClaims
	if claims == nil {
		claims = make(map[string]interface{})
	}
	claims["admin"] = true

	err = firebase.AuthClient.SetCustomUserClaims(context.Background(), user.UID, claims)
	if err != nil {
		log.Printf("Erro ao definir custom claims para UID %s: %v", user.UID, err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao definir a claim de admin")
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"message": fmt.Sprintf("Usuário %s agora é um administrador.", p.Email)})
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
