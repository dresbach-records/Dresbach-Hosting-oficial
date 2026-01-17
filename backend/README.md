# Backend Go para Dresbach Hosting (Arquitetura Escalável)

Este diretório contém o código-fonte para o servidor de API Go, construído com uma arquitetura modular e escalável usando o framework Gin.

## Visão Geral da Arquitetura

- **`cmd/api/main.go`**: O ponto de entrada da aplicação. Responsável por carregar configurações, inicializar serviços (Firebase, Sessão, WHM) e iniciar o servidor web.
- **`internal/`**: Contém toda a lógica de negócio, estritamente separada da camada de apresentação.
  - **`config/`**: Carregamento de variáveis de ambiente.
  - **`firebase/`**: Inicialização e configuração do Firebase Admin SDK.
  - **`handlers/`**: A lógica principal para cada rota da API (ex: `RegisterHandler`, `LoginHandler`, `ProvisionAccountHandler`).
  - **`middleware/`**: Middlewares para o Gin, como o `AuthMiddleware` para proteger rotas.
  - **`routes/`**: Definição e agrupamento de todas as rotas da API.
  - **`session/`**: Configuração do gerenciamento de sessão baseado em cookies.
  - **`utils/`**: Funções auxiliares, como padronização de respostas JSON (`Success`, `Error`).
  - **`whm/`**: Cliente da API para interagir com o servidor WHM/cPanel.

## Como Executar Localmente

1.  **Pré-requisitos**:
    - [Go](https://go.dev/doc/install) (versão 1.21 ou superior).
    - Um arquivo `serviceAccountKey.json` do seu projeto Firebase.
    - Chave do site reCAPTCHA Enterprise.
    - Acesso à API de um servidor WHM/cPanel.

2.  **Configurar Variáveis de Ambiente**:
    - Renomeie ou copie `../../.env.example` para `../../.env` na raiz do projeto.
    - Preencha as seguintes variáveis no arquivo `.env`:
      ```env
      # Chave secreta para criptografar cookies de sessão. Gere com: openssl rand -base64 32
      SESSION_KEY="SUA_CHAVE_SECRETA_SUPER_LONGA_E_ALEATORIA"

      # Caminho para sua chave de conta de serviço do Firebase
      GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

      # O ID do seu projeto Google Cloud (o mesmo do Firebase)
      GOOGLE_CLOUD_PROJECT="seu-firebase-project-id"
      
      # A chave do *site* reCAPTCHA Enterprise
      RECAPTCHA_SITE_KEY="sua-chave-de-site-recaptcha"

      # Credenciais da API WHM/cPanel
      WHM_HOST="IP_OU_HOSTNAME_DO_SEU_SERVIDOR_WHM"
      WHM_USER="SEU_USUARIO_WHM_RESELLER"
      WHM_TOKEN="SEU_TOKEN_DE_API_WHM"
      ```

3.  **Coloque a Chave de Serviço**:
    - Coloque seu arquivo `serviceAccountKey.json` na **raiz do projeto** (um nível acima do diretório `backend`).

4.  **Instalar Dependências**:
    - Navegue até este diretório (`backend/`) e execute:
      ```sh
      go mod tidy
      ```

5.  **Executar o Servidor**:
    - Navegue até o diretório `backend/` e execute:
      ```sh
      go run ./cmd/api
      ```
    - O servidor será iniciado em `http://localhost:8080`.

## Implantação (Deploy) no Firebase

Este backend está preparado para ser implantado no Firebase App Hosting (que usa Cloud Run por baixo dos panos). O `firebase.json` na raiz do projeto já está configurado para direcionar as requisições de `/api/**` para este serviço Go.

Para implantar, você normalmente executaria o comando `firebase deploy` a partir da raiz do projeto.
