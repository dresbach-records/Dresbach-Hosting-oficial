# Dresbach Hosting – Documentação Interna

## Ambientes
- dev
- staging
- prod

## Arquitetura de Domínios (Produção)
- **Site Principal:** `dresbachhosting.com.br`
- **Área do Cliente:** `area-do-cliente.dresbachhosting.com.br`
- **Painel Admin:** `admin.dresbachhosting.com.br`
- **Checkout de Pagamentos:** `checkout.dresbachhosting.com.br`

Esta estrutura será gerenciada via proxy reverso (ex: Nginx) na VPS, direcionando os subdomínios para as rotas correspondentes da aplicação Next.js.

## Autenticação
- JWT (atual)

## Regras Críticas
- Primeiro login vira admin automaticamente. Para forçar um admin específico, defina a variável de ambiente `DRESBACH_INITIAL_ADMIN`.
- Frontend não define permissões
- RBAC obrigatório em todas as rotas

## CI/CD
- GitHub Actions
- Testes automáticos
- Deploy VPS

## Contato Interno
- Dev Lead
- Operações
- Suporte
