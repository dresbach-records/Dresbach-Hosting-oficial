# Dresbach Hosting – Documentação Interna de Arquitetura

Este documento descreve a arquitetura de produção, regras de negócio e comportamento esperado entre frontend e backend.

## Ambientes
- `dev`
- `staging`
- `prod`

---

## 🌐 MAPA DE DOMÍNIOS E RESPONSABILIDADES (Produção)

O sistema utiliza subdomínios para separar as funcionalidades, com o backend (Go) identificando o contexto através do header `Host`.

### 🏠 Site institucional
- **URL:** `https://www.dresbachhosting.com.br`
- **Responsabilidades:**
    - Homepage pública e landing pages
    - Aplicação de modos especiais (Natal, contagem regressiva)
    - Foco em SEO
- **Regras:**
    - NÃO exige autenticação.

### 👤 Área do Cliente
- **URL:** `https://area-do-cliente.dresbachhosting.com.br`
- **Responsabilidades:**
    - Login e autenticação de clientes
    - Dashboard com serviços, faturas e suporte
- **Regras:**
    - **Sempre disponível**, mesmo durante manutenções ou modos especiais do site institucional.
    - O tema visual pode mudar (ex: Natal), mas a funcionalidade é permanente.

### 💳 Checkout / Pagamentos
- **URL:** `https://checkout.dresbachhosting.com.br`
- **Responsabilidades:**
    - Fluxo de pagamento e integração com gateway
    - Processamento de webhooks de confirmação
- **Regras:**
    - **Nunca deve ser bloqueado** ou entrar em modo de contagem regressiva.
    - Estabilidade e disponibilidade são prioridade máxima.

### 🛠 Painel Administrativo (Empresa)
- **URL:** `https://admin.dresbachhosting.com.br`
- **Responsabilidades:**
    - Gestão interna de clientes, pedidos, serviços e logs.
    - Acesso a configurações globais (ex: `SITE_MODE`, `THEME_MODE`).
- **Regras:**
    - Acesso restrito a usuários com perfil `admin`.

---

## 🧠 COMPORTAMENTO DO BACKEND (OBRIGATÓRIO)

O backend deve usar o header `Host` para aplicar regras específicas.

- **Host: `www.dresbachhosting.com.br`**
    - Pode entrar em modo `countdown`. Se ativado, o payload da API principal deve retornar:
    ```json
    {
      "mode": "countdown",
      "countdown_end": "2025-12-31T23:59:59-03:00"
    }
    ```

- **Host: `area-do-cliente.dresbachhosting.com.br`**
    - **IGNORA** a flag `SITE_MODE`.
    - Pode retornar uma flag de tema, se aplicável:
    ```json
    {
      "theme": "christmas"
    }
    ```

- **Host: `checkout.dresbachhosting.com.br`**
    - **NÃO aplica** temas ou modos especiais. Focado apenas na lógica de pagamento.

- **Host: `admin.dresbachhosting.com.br`**
    - Fornece endpoints para alterar as flags globais (`SITE_MODE`, `THEME_MODE`, `COUNTDOWN_END`).

---

## 📦 Divisão de Responsabilidades (Frontend vs. Backend)

- **Backend (Go):**
    - Decide o **estado** global do sistema (flags).
    - Aplica regras de negócio por subdomínio.
    - Gerencia a lógica de dados e autenticação.
- **Frontend (Next.js):**
    - Decide o **layout** e a experiência visual.
    - Renderiza componentes e temas com base nas flags recebidas do backend.

---

## 🔐 COOKIES E AUTENTICAÇÃO (IMPORTANTE)

- **Cookies de sessão (JWT)** devem ser configurados com `Domain=.dresbachhosting.com.br` para permitir login único e navegação autenticada entre os subdomínios.
- O frontend não define permissões; apenas consome o token e gerencia o estado de login do usuário.

---

## 🌍 CORS (OBRIGATÓRIO CONFIGURAR)

O backend deve permitir requisições explicitamente dos seguintes origins:
- `https://www.dresbachhosting.com.br`
- `https://area-do-cliente.dresbachhosting.com.br`
- `https://checkout.dresbachhosting.com.br`
- `https://admin.dresbachhosting.com.br`

---

## 🚦 STATUS, SEO E REGRAS CRÍTICAS

- **Downtime:** O sistema não deve ter downtime. Manutenções devem usar os modos especiais.
- **Status HTTP:** Nunca retornar `503`. A página de contagem regressiva deve retornar `200 OK` para não prejudicar o SEO.
- **Primeiro Admin:** O primeiro usuário a se registrar vira `admin`. Para forçar um admin específico, defina a variável de ambiente `DRESBACH_INITIAL_ADMIN`.
- **RBAC:** Controle de acesso baseado em role é obrigatório em todas as rotas de backend.

---

## 🚀 CI/CD
- **Plataforma:** GitHub Actions
- **Fluxo:** Testes automáticos (API Contract & E2E) → Deploy para VPS.

## 📞 Contato Interno
- Dev Lead
- Operações
- Suporte
