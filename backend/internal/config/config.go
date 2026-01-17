package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// LoadEnv carrega variáveis de ambiente de um arquivo .env.
// O path deve ser o diretório que contém o arquivo .env.
func LoadEnv(path string) error {
	cwd, _ := os.Getwd()
	log.Printf("Tentando carregar .env de: %s/%s/.env (CWD: %s)", path, cwd)
	err := godotenv.Load(path + "/.env")
	if err != nil {
		log.Printf("Erro ao carregar .env: %v", err)
		return err
	}
	return nil
}
