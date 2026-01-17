# Guias Rápidos por Perfil

## 👨‍💻 GUIA RÁPIDO — DESENVOLVEDOR (DEV)

**Objetivo:** desenvolver sem quebrar produção.

### Stack

- **Frontend:** Next.js
- **Backend:** Go (API v1)
- **Auth:** Firebase (JWT próprio preparado)
- **DB:** Firestore (SQL futuro)
- **Docs:** OpenAPI + Swagger UI

### Regras de ouro

- ❌ Frontend não decide permissão
- ❌ Não criar endpoint fora do OpenAPI
- ❌ Não testar direto em produção
- ✅ Versionar tudo (/api/v1)
- ✅ Usar feature flags

### Comandos essenciais
```bash
go test ./...
golangci-lint run
swagger-cli validate docs/openapi.yaml
newman run docs/postman_collection.json -e docs/postman_environment.json
```

### Fluxo de trabalho

1. Criar branch
2. Alterar OpenAPI
3. Implementar backend
4. Ajustar frontend
5. Testes
6. PR → CI → merge

---

## 🎧 GUIA RÁPIDO — SUPORTE (STAFF)

**Objetivo:** resolver problemas sem risco.

### Pode fazer

- Ver clientes
- Ver serviços
- Responder tickets
- Suspender serviços (se autorizado)
- Registrar notas internas

### Não pode

- Alterar permissões
- Criar admin
- Mexer em billing manualmente
- Acessar banco diretamente

### Fluxo de atendimento

1. Abrir ticket
2. Analisar logs (se necessário)
3. Executar ação permitida
4. Registrar tudo no ticket
5. Encerrar

---

## 👑 GUIA RÁPIDO — ADMIN

**Objetivo:** operar e governar o sistema.

### Responsabilidades

- Criar produtos
- Gerenciar servidores WHM
- Definir preços
- Gerenciar permissões
- Ativar/desativar features
- Aprovar pedidos críticos

### Boas práticas

- Usar staging antes de produção
- Ativar features por flag
- Monitorar métricas diariamente
- Nunca criar admin manual no banco
