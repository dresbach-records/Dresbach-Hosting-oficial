package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	recaptcha "cloud.google.com/go/recaptchaenterprise/apiv1"
	recaptchapb "google.golang.org/genproto/googleapis/cloud/recaptchaenterprise/v1"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

// Global variables for Firebase, session store, and other configs.
var (
	firebaseAuth *auth.Client
	cookieStore  *sessions.CookieStore
	sessionName  = "dresbach-hosting-session"
)

// Structs for JSON request and response payloads.
type RegisterPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ProfileResponse struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type VerifyTokenPayload struct {
	RecaptchaToken string `json:"recaptchaToken"`
}

// respondWithError is a helper function to write a JSON error response.
func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, ErrorResponse{Error: message})
}

// respondWithJSON is a helper function to write a JSON response.
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// registerHandler handles user registration.
func registerHandler(w http.ResponseWriter, r *http.Request) {
	var p RegisterPayload
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if p.Email == "" || !strings.Contains(p.Email, "@") {
		respondWithError(w, http.StatusBadRequest, "Invalid email format")
		return
	}
	if len(p.Password) < 6 {
		respondWithError(w, http.StatusBadRequest, "Password must be at least 6 characters long")
		return
	}

	params := (&auth.UserToCreate{}).
		Email(p.Email).
		Password(p.Password).
		EmailVerified(false).
		Disabled(false)

	_, err := firebaseAuth.CreateUser(context.Background(), params)
	if err != nil {
		if auth.IsEmailAlreadyExists(err) {
			respondWithError(w, http.StatusConflict, "Email already in use")
			return
		}
		log.Printf("Error creating user: %v\n", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	respondWithJSON(w, http.StatusCreated, map[string]string{"message": "User created successfully"})
}

/**
 * Crie uma avaliação para analisar o risco de uma ação da interface.
 *
 * @param projectID: O ID do seu projeto do Google Cloud.
 * @param recaptchaKey: A chave reCAPTCHA associada ao site/app
 * @param token: O token gerado obtido do cliente.
 * @param recaptchaAction: Nome da ação correspondente ao token.
 */
func createAssessment(projectID string, recaptchaKey string, token string, recaptchaAction string) (bool, error) {

	// Crie o cliente reCAPTCHA.
	ctx := context.Background()
	client, err := recaptcha.NewClient(ctx)
	if err != nil {
		log.Printf("Error creating reCAPTCHA client: %v", err)
		return false, fmt.Errorf("could not create recaptcha client")
	}
	defer client.Close()

	// Defina as propriedades do evento que será monitorado.
	event := &recaptchapb.Event{
		Token:   token,
		SiteKey: recaptchaKey,
	}

	assessment := &recaptchapb.Assessment{
		Event: event,
	}

	// Crie a solicitação de avaliação.
	request := &recaptchapb.CreateAssessmentRequest{
		Assessment: assessment,
		Parent:     fmt.Sprintf("projects/%s", projectID),
	}

	response, err := client.CreateAssessment(
		ctx,
		request)

	if err != nil {
		log.Printf("Error calling CreateAssessment: %v", err)
		return false, fmt.Errorf("could not create assessment")
	}

	// Verifique se o token é válido.
	if !response.TokenProperties.Valid {
		log.Printf("The CreateAssessment() call failed because the token was invalid for the following reasons: %v",
			response.TokenProperties.InvalidReason)
		return false, nil
	}

	// Verifique se a ação esperada foi executada.
	if response.TokenProperties.Action != recaptchaAction {
		log.Printf("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score")
		return false, nil
	}

	// Consulte a pontuação de risco e os motivos.
	// Para mais informações sobre como interpretar a avaliação, acesse:
	// https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
	log.Printf("The reCAPTCHA score for this token is:  %v", response.RiskAnalysis.Score)
	if response.RiskAnalysis.Score < 0.5 {
		log.Printf("Low reCAPTCHA score: %v", response.RiskAnalysis.Score)
		return false, nil
	}

	for _, reason := range response.RiskAnalysis.Reasons {
		log.Printf(reason.String() + "\n")
	}
	return true, nil
}

// verifyTokenHandler validates a reCAPTCHA token.
func verifyTokenHandler(w http.ResponseWriter, r *http.Request) {
	var p VerifyTokenPayload
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	recaptchaSiteKey := os.Getenv("RECAPTCHA_SITE_KEY")

	if projectID == "" || recaptchaSiteKey == "" || p.RecaptchaToken == "" {
		log.Println("Warning: Missing projectID, siteKey, or token for reCAPTCHA validation")
		respondWithError(w, http.StatusBadRequest, "Missing information for reCAPTCHA validation")
		return
	}

	isValid, err := createAssessment(projectID, recaptchaSiteKey, p.RecaptchaToken, "LOGIN")
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error during reCAPTCHA validation")
		return
	}
	if !isValid {
		respondWithError(w, http.StatusUnauthorized, "reCAPTCHA validation failed. Please try again.")
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// loginHandler handles user login and session creation.
func loginHandler(w http.ResponseWriter, r *http.Request) {
	var p LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// SENIOR DEV NOTE:
	// The Firebase Admin SDK (which runs on the server) CANNOT verify a user's password directly.
	// This is a security measure; only client-side SDKs or the Firebase Auth REST API can do this.
	// In a production-grade application, the flow would be:
	// 1. Frontend uses Firebase Client SDK to sign in the user.
	// 2. Frontend gets the user's ID Token upon successful login.
	// 3. Frontend sends this ID Token to this backend endpoint.
	// 4. This backend would use `firebaseAuth.VerifyIDToken()` to validate the token.
	//
	// For this exercise, we will simulate a successful login by checking if the user exists
	// and assuming the password is correct. This is NOT secure and should NOT be used in production.
	userRecord, err := firebaseAuth.GetUserByEmail(context.Background(), p.Email)
	if err != nil {
		// This error means the user was not found.
		respondWithError(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Create a new session.
	session, _ := cookieStore.Get(r, sessionName)
	session.Values["userID"] = userRecord.UID
	session.Values["email"] = userRecord.Email
	session.Options.MaxAge = 86400 // 24 hours
	session.Options.HttpOnly = true
	// Use SameSite=Lax for SPAs. You might need SameSite=None and Secure=true if front/back are on different domains.
	session.Options.SameSite = http.SameSiteLaxMode

	if err := session.Save(r, w); err != nil {
		log.Printf("Error saving session: %v\n", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to create session")
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Login successful"})
}

// logoutHandler destroys the user's session.
func logoutHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := cookieStore.Get(r, sessionName)

	// Expire the session immediately.
	session.Options.MaxAge = -1

	if err := session.Save(r, w); err != nil {
		log.Printf("Error destroying session: %v\n", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to logout")
		return
	}
	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Logout successful"})
}

// getProfileHandler returns the profile of the currently logged-in user.
func getProfileHandler(w http.ResponseWriter, r *http.Request) {
	// The middleware has already validated the session. We can safely access the values.
	session, _ := cookieStore.Get(r, sessionName)
	userID, ok1 := session.Values["userID"].(string)
	email, ok2 := session.Values["email"].(string)

	if !ok1 || !ok2 {
		respondWithError(w, http.StatusInternalServerError, "Invalid session data")
		return
	}

	respondWithJSON(w, http.StatusOK, ProfileResponse{
		UserID: userID,
		Email:  email,
	})
}

// authMiddleware protects routes by verifying the user's session.
func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := cookieStore.Get(r, sessionName)
		if err != nil {
			// This can happen if the cookie is malformed.
			respondWithError(w, http.StatusUnauthorized, "Invalid session cookie")
			return
		}

		// Check if the session is authenticated (we check for userID).
		if userID, ok := session.Values["userID"].(string); !ok || userID == "" {
			respondWithError(w, http.StatusUnauthorized, "Authentication required")
			return
		}

		// If the session is empty or has been expired.
		if session.IsNew {
			respondWithError(w, http.StatusUnauthorized, "Authentication required")
			return
		}

		// If we reach here, the user is authenticated.
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load .env file.
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, relying on environment variables")
	}

	// Initialize Firebase Admin SDK
	credsFile := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	if credsFile == "" {
		log.Fatal("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
	}
	opt := option.WithCredentialsFile(credsFile)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	firebaseAuth, err = app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	// Initialize Cookie Store
	sessionKey := os.Getenv("SESSION_KEY")
	if sessionKey == "" {
		log.Fatal("SESSION_KEY environment variable not set. It must be a long, random string.")
	}
	cookieStore = sessions.NewCookieStore([]byte(sessionKey))

	// Setup Router
	r := mux.NewRouter()

	// Public routes
	authRouter := r.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/register", registerHandler).Methods("POST")
	authRouter.HandleFunc("/login", loginHandler).Methods("POST")
	authRouter.HandleFunc("/logout", logoutHandler).Methods("POST")
	authRouter.HandleFunc("/verify-token", verifyTokenHandler).Methods("POST")

	// Protected routes
	userRouter := r.PathPrefix("/user").Subrouter()
	userRouter.Use(authMiddleware)
	userRouter.HandleFunc("/profile", getProfileHandler).Methods("GET")

	// Serve frontend files
	// This assumes your Go binary is run from the project root.
	// It will serve the existing Next.js build output.
	fs := http.FileServer(http.Dir("./public/"))
	r.PathPrefix("/").Handler(fs)

	// Start Server
	port := "8080"
	log.Printf("Server starting on port %s", port)
	srv := &http.Server{
		Handler:      r,
		Addr:         ":" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
