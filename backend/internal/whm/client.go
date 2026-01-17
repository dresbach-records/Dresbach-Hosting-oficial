package whm

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// Client holds the configuration for the WHM API client.
type Client struct {
	BaseURL    string
	User       string
	Token      string
	HttpClient *http.Client
}

var WhmClient *Client

// InitWhmClient creates and configures the global WHM API client.
func InitWhmClient() {
	host := os.Getenv("WHM_HOST")
	user := os.Getenv("WHM_USER")
	token := os.Getenv("WHM_TOKEN")

	if host == "" || user == "" || token == "" {
		log.Println("Aviso: WHM_HOST, WHM_USER, e WHM_TOKEN não estão configuradas. A integração com WHM será desativada.")
		WhmClient = nil // Explicitly set to nil
		return
	}

	WhmClient = &Client{
		BaseURL:    fmt.Sprintf("https://%s:2087/json-api/", host),
		User:       user,
		Token:      token,
		HttpClient: &http.Client{},
	}
	log.Println("Cliente WHM inicializado com sucesso.")
}

// Request makes a generic request to the WHM API.
func (c *Client) Request(endpoint string, method string, body io.Reader) (*http.Response, error) {
	url := c.BaseURL + endpoint
	log.Printf("Fazendo requisição WHM para: %s", url)

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, fmt.Errorf("falha ao criar requisição WHM: %w", err)
	}

	// Note: The Authorization header format is "whm user:apitoken"
	req.Header.Set("Authorization", "whm "+c.User+":"+c.Token)

	resp, err := c.HttpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("falha ao executar requisição WHM: %w", err)
	}

	return resp, nil
}
