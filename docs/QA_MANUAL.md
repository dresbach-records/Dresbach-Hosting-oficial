# MANUAL DE QA — DRESBACH HOSTING

**Objetivo:** Garantir que nada entra em produção sem estar validado funcionalmente, tecnicamente e operacionalmente.

## 3.1 Tipos de Teste

| Tipo               | Obrigatório |
| ------------------ | :---------: |
| Smoke              |      ✅      |
| Contrato (OpenAPI) |      ✅      |
| RBAC               |      ✅      |
| E2E                |      ✅      |
| Regressão          |      ✅      |
| Performance básica |      🟡      |

## 3.2 Checklist de Homologação (Release)

### Autenticação

- [ ] Login funciona
- [ ] Primeiro usuário vira admin
- [ ] Token expira corretamente

### RBAC

- [ ] Admin acessa tudo
- [ ] Staff limitado
- [ ] Client bloqueado em rotas admin

### Serviços

- [ ] Provisiona
- [ ] Suspende
- [ ] Reativa
- [ ] Estados corretos

### Billing

- [ ] Fatura gerada
- [ ] Pagamento processado
- [ ] Serviço não ativa sem pagamento

### Domínios (se ativo)

- [ ] Lookup RDAP
- [ ] Cache
- [ ] Rate limit

## 3.3 Ambiente de Homologação

- Base de dados isolada
- Tokens próprios
- Webhooks em modo sandbox
- Logs em nível DEBUG

## 3.4 Critérios de Aprovação

Um release só é aprovado se:

✔️ Newman passa 100%
✔️ OpenAPI válido
✔️ Nenhum erro crítico
✔️ Fluxo E2E completo ok
✔️ Logs e auditoria funcionando

## 3.5 Registro de Homologação

Cada release deve gerar:

- **versão:**
- **data:**
- **ambiente:**
- **responsável:**
- **status:**
- **observações:**
