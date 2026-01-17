# MANUAL NOC — OPERAÇÃO & INCIDENTES

**Objetivo:** Manter o sistema disponível, seguro e auditável.

## 🔍 MONITORAMENTO

### Endpoints críticos
- `GET /health`

### Indicadores

- Latência
- Erros 5xx
- Falhas de login
- Jobs atrasados

## 🚨 INCIDENTES

### Classificação
| Severidade | Exemplo                  |
| :--------- | :----------------------- |
| S1         | Sistema fora do ar       |
| S2         | Billing parado           |
| S3         | Erro isolado             |
| S4         | UI / cosmético           |

### Procedimento padrão
1. Confirmar incidente
2. Ver logs
3. Ver métricas
4. Ver auditoria
5. Aplicar correção
6. Comunicar
7. Registrar pós-mortem

## 🔄 ROLLBACK

### Firebase
```bash
firebase hosting:rollback
```

### VPS
```bash
docker stop dresbach-api
docker run versão-anterior
```

## 🔐 SEGURANÇA

- Rotação de secrets periódica
- Auditoria ativa
- RBAC revisado
- Acesso mínimo necessário

## 📅 ROTINAS NOC

### Diária

- Verificar health
- Ver erros
- Ver jobs

### Semanal

- Revisar logs
- Revisar permissões

### Mensal

- Testar backup
- Revisar flags
- Planejar releases
