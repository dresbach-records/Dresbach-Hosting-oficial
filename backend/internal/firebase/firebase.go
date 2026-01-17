package firebase

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/firestore"
	"google.golang.org/api/option"
)

var (
	App             *firebase.App
	AuthClient      *auth.Client
	FirestoreClient *firestore.Client
)

// InitFirebase inicializa o app Firebase Admin SDK e os clientes de serviço.
func InitFirebase() {
	var err error
	var opt option.ClientOption

	// A variável GOOGLE_APPLICATION_CREDENTIALS é lida automaticamente pelo SDK
	// em ambientes de produção (como Cloud Run). Para desenvolvimento local,
	// ela deve ser definida no seu ambiente ou no arquivo .env.
	credsFile := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	if credsFile != "" {
		opt = option.WithCredentialsFile(credsFile)
	}

	// O GOOGLE_CLOUD_PROJECT é injetado automaticamente no Cloud Run.
	// Para desenvolvimento local, pode ser definido no .env.
	conf := &firebase.Config{
		ProjectID: os.Getenv("GOOGLE_CLOUD_PROJECT"),
	}

	App, err = firebase.NewApp(context.Background(), conf, opt)
	if err != nil {
		log.Fatalf("erro ao inicializar o app Firebase: %v\n", err)
	}

	AuthClient, err = App.Auth(context.Background())
	if err != nil {
		log.Fatalf("erro ao obter o cliente de autenticação Firebase: %v\n", err)
	}

	FirestoreClient, err = App.Firestore(context.Background())
	if err != nil {
		log.Fatalf("erro ao obter o cliente de firestore Firebase: %v\n", err)
	}

	log.Println("Firebase Admin SDK inicializado com sucesso.")
}
