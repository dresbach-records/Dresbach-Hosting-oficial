package handlers

import (
	"fmt"
	"log"
	"net/http"

	"backend/internal/stripe"
	"backend/internal/utils"

	"github.com/gin-gonic/gin"
	stripego "github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/paymentintent"
)

type CreatePaymentIntentPayload struct {
	Plan  string `json:"plan" binding:"required"`  // e.g., "Profissional"
	Cycle string `json:"cycle" binding:"required"` // e.g., "annually"
}

// Preços definidos no backend para segurança (em BRL)
// Chaves: "NomeDoPlano_IDdoCiclo"
var planPrices = map[string]float64{
	"Solteiro_monthly":     3.99,
	"Solteiro_triennially": 10.47,
	"Solteiro_annually":    35.88,
	"Profissional_monthly":     4.99,
	"Profissional_triennially": 13.47,
	"Profissional_annually":    47.88,
	"Negócios_monthly":     9.99,
	"Negócios_triennially": 26.97,
	"Negócios_annually":    95.88,
}

// CreatePaymentIntentHandler cria um Payment Intent no Stripe.
func CreatePaymentIntentHandler(c *gin.Context) {
	var p CreatePaymentIntentPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		utils.Error(c, http.StatusBadRequest, "Corpo da requisição inválido: "+err.Error())
		return
	}

	// Calcula o preço no backend
	// A chave é, por exemplo, "Profissional_annually"
	priceKey := fmt.Sprintf("%s_%s", p.Plan, p.Cycle)
	price, ok := planPrices[priceKey]
	if !ok {
		log.Printf("Chave de preço inválida recebida: %s", priceKey)
		utils.Error(c, http.StatusBadRequest, "Plano ou ciclo de pagamento inválido.")
		return
	}
	amountInCents := int64(price * 100)

	if stripe.StripeClient == nil {
		log.Println("Aviso: Cliente Stripe não configurado. Simulando resposta de Payment Intent.")
		// Simula uma resposta de sucesso em desenvolvimento se o Stripe não estiver configurado
		utils.Success(c, http.StatusOK, gin.H{"clientSecret": "pi_simulated_secret_for_dev_env", "amount": amountInCents})
		return
	}

	// Crie um PaymentIntent com o valor e a moeda
	params := &stripego.PaymentIntentParams{
		Amount:   stripego.Int64(amountInCents),
		Currency: stripego.String(string(stripego.CurrencyBRL)),
		AutomaticPaymentMethods: &stripego.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripego.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		log.Printf("Erro ao criar Payment Intent no Stripe: %v", err)
		utils.Error(c, http.StatusInternalServerError, "Falha ao criar a transação de pagamento.")
		return
	}

	log.Printf("Payment Intent %s criado com sucesso.", pi.ID)

	utils.Success(c, http.StatusOK, gin.H{
		"clientSecret": pi.ClientSecret,
		"amount":       amountInCents,
	})
}
