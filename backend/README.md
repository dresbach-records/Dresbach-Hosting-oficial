# DRESBACH HOSTING - Documentação Oficial da Plataforma (Equipe)

**Versão:** 1.0
**Status:** Produção
**Produto:** Plataforma de Hosting & Domínios (nível WHMCS)

## 1. VISÃO GERAL DO PRODUTO

A plataforma Dresbach Hosting é um sistema enterprise, API-first, para:

- Gestão de clientes
- Provisionamento automático de hosting (WHM/cPanel)
- Billing recorrente
- Suporte (tickets)
- Automação
- RBAC (admin, staff, client)
- Integração com domínios (.br via RDAP / EPP futuro)

O sistema não depende de WHMCS e foi projetado para escala, auditoria e operação profissional.

## 2. ARQUITETURA (ALTO NÍVEL)

```
Frontend (Admin / Client)
        ↓
Backend Go (API v1)
        ↓
┌─────────────┬─────────────┬─────────────┐
│Firebase Auth│  Firestore  │ WHM / APIs  │
│(JWT futuro) │ (SQL futuro)│ Pagamentos  │
└─────────────┴─────────────┴─────────────┘
```

**Princípios:**

- Frontend não tem regra de negócio
- Backend é stateless
- Tudo passa por API versionada
- Segurança > Conveniência

## 3. AMBIENTES

| Ambiente | Uso                 |
| :------- | :------------------ |
| `dev`      | Desenvolvimento local |
| `staging`  | Testes reais        |
| `prod`     | Produção            |

> ❗ Nunca testar direto em produção.

## 4. AUTENTICAÇÃO & ACESSO

**Modelo atual:**

- Firebase Auth (login)
- Backend valida token
- Primeiro login → admin automático
- Depois disso, RBAC governa tudo

**Roles:**

- `admin` → tudo
- `staff` → operação
- `client` → área própria

> ⚠️ Frontend não define role.

## 5. RBAC (PERMISSÕES)

**Formato:**
`recurso.ação`

**Exemplos:**

- `clients.read`
- `services.suspend`
- `tickets.reply`
- `settings.update`

**Regra:**
Se não tiver permissão explícita → 403

## 6. MÓDULOS DO SISTEMA

### 6.1 Clientes

- Cadastro
- Status
- Serviços
- Faturas
- Tickets
- Notas internas

### 6.2 Produtos

- Planos de hosting
- Addons
- Preços mensais/anuais
- Mapeamento WHM

### 6.3 Serviços (Hosting)

**Estados:**

- `pending_provision`
- `active`
- `suspended`
- `terminated`

**Ações:**

- Provisionar (WHM)
- Suspender
- Reativar
- Encerrar

### 6.4 Billing & Faturas

**Estados:**

- `draft`
- `unpaid`
- `paid`
- `overdue`
- `cancelled`

**Funcionalidades:**

- Faturas recorrentes
- Pagamentos via gateway
- Webhooks
- Idempotência obrigatória

### 6.5 Suporte (Tickets)

- Departamentos
- Prioridade
- SLA (futuro)
- Histórico imutável
- Notas internas (staff)

### 6.6 Automação

**Jobs:**

- Gerar faturas
- Suspender inadimplentes
- Avisos de vencimento
- Sync WHM
- Limpeza de logs

### 6.7 Domínios

- Consulta RDAP (.br)
- Registro EPP (futuro)
- Domínio tratado como serviço

## 7. API (REGRAS PARA DEVS)

**Base:**
`/api/v1`

**Headers obrigatórios:**
`Authorization: Bearer <token>`

**Respostas:**

- `2xx` → sucesso
- `4xx` → erro cliente
- `5xx` → erro sistema

**Nunca:**

- quebrar contrato OpenAPI
- alterar resposta sem versionar

## 8. SEGURANÇA (OBRIGATÓRIO)

- Secrets via ENV
- Rate limit ativo
- Logs de auditoria
- Sem endpoints perigosos
- Sem dados sensíveis no frontend

## 9. LOGS & AUDITORIA

Tudo que é sensível gera:

- `user_id`
- `ação`
- `recurso`
- `timestamp`
- `ip`

Esses logs não são apagados.

## 10. OPERAÇÃO & SUPORTE

**Healthcheck:**
`GET /health`

**Em caso de erro:**

1.  Ver logs
2.  Ver auditoria
3.  Reproduzir em staging
4.  Só então corrigir

## 11. DEPLOY & CI/CD

- Deploy automático via GitHub Actions
- Firebase ou VPS
- Rollback possível
- Feature flags controlam risco

## 12. BOAS PRÁTICAS PARA A EQUIPE

**Dev:**

- Não pular RBAC
- Não criar endpoints ad-hoc
- Testar em staging

**Suporte:**

- Nunca mexer direto no banco
- Usar painel admin
- Registrar tudo em ticket

**Gestão:**

- Ativar features por flag
- Monitorar métricas
- Planejar EPP com cuidado

## 13. O QUE NÃO FAZER

- ❌ Criar admin manual no banco
- ❌ Alterar role via frontend
- ❌ Usar produção para teste
- ❌ Ignorar logs
- ❌ Quebrar OpenAPI

## 14. REFERÊNCIAS INTERNAS

- **OpenAPI:** `openapi.yaml`
- **CI/CD:** `.github/workflows/`
- **Infra:** `firebase.json`, `Dockerfile`
- **Código:** `backend/internal/`

---

✅ **CONCLUSÃO**

Esta documentação define:

- Como o sistema funciona
- Como operar
- Como evoluir sem quebrar
- Como manter padrão enterprise

Ela é o manual oficial da plataforma.
