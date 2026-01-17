package stripe

import (
	"log"
	"os"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/client"
)

var (
	// StripeClient é um cliente global do Stripe
	StripeClient *client.API
)

// InitStripe inicializa o cliente Stripe a partir de variáveis de ambiente.
func InitStripe() {
	apiKey := os.Getenv("STRIPE_SECRET_KEY")
	if apiKey == "" {
		log.Println("Aviso: STRIPE_SECRET_KEY não está configurada. A integração com Stripe será desativada.")
		StripeClient = nil
		return
	}

	StripeClient = &client.API{}
	StripeClient.Init(apiKey, nil)
	log.Println("Cliente Stripe inicializado com sucesso.")
}
