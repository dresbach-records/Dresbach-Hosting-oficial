# Dresbach Hosting – Documentação Interna

## Ambientes
- dev
- staging
- prod

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
