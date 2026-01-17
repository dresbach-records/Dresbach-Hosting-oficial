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

## 4. Mock Servers para Testes Automatizados

Para garantir que os testes E2E possam rodar de forma isolada, segura e previsível (especialmente em ambientes de CI/CD), utilizamos mock servers para simular integrações externas.

### 4.1 Mock Server WHM (Go)

Simula as respostas da API do WHM para criação, suspensão e outras operações de contas.

**Localização:** `mock/whm/main.go`

```go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/whm/createacct", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "success",
			"ip":     "192.168.0.10",
			"user":   "demo_user",
		})
	})
	r.POST("/whm/suspendacct", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "suspended"})
	})
	r.POST("/whm/unsuspendacct", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "active"})
	})

	r.Run(":9001")
}
```

**Uso:** Inicie este servidor e aponte a variável de ambiente `WHM_API_URL` do backend principal para `http://localhost:9001`.

### 4.2 Mock Server de Pagamentos (Node.js)

Simula o gateway de pagamento e a recepção de webhooks.

**Localização:** `mock/payments/server.js`

```javascript
const express = require("express");
const app = express();
app.use(express.json());

app.post("/payments/charge", (req, res) => {
  res.json({ status: "paid", transaction_id: "tx_123" });
});

app.post("/payments/webhook", (req, res) => {
  res.status(200).send("ok");
});

app.listen(9002);
```

**Uso:** Inicie este servidor e aponte a variável de ambiente `PAYMENT_GATEWAY_URL` para `http://localhost:9002`.

## 5. Testes de Carga e Performance (k6)

Utilizamos o k6 para validar a escalabilidade e a latência da API antes de cada release em produção.

### 5.1 Teste de Carga da API
Este script valida a saúde geral e a performance dos endpoints críticos.

**Localização:** `tests/load/api_load.js`
```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 50 }, // rampa de subida
    { duration: "1m", target: 100 }, // carga sustentada
    { duration: "30s", target: 0 },   // rampa de descida
  ],
};

export default function () {
  const res = http.get(
    "https://api.staging.dresbach.com/api/v1/health"
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
    "latency < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### 5.2 Teste de Fluxo
Este script simula um fluxo de usuário autenticado.

**Localização:** `tests/load/login_flow.js`
```javascript
import http from "k6/http";

export default function () {
  http.get("https://api.staging.dresbach.com/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  });
}
```

### 5.3 Execução e Critérios de Aprovação
Os testes são executados via `k6 run tests/load/api_load.js`. Um release só é aprovado se os seguintes critérios forem atendidos:
- **p95 (latência) < 500ms**
- **Taxa de erro < 1%**
- **Zero timeouts**
