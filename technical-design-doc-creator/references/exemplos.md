# Exemplos: Alto Nível vs Implementação e Anti-Patterns

## Alto Nível vs Implementação

### ❌ RUIM (Específico Demais de Implementação)

````markdown
**Passos de Rollback**:

```bash
curl -X PATCH https://api.launchdarkly.com/flags/FEATURE_X \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"enabled": false}'

nx db:rollback billing
```
````

### ✅ BOM (Decisão de Alto Nível)

```markdown
**Passos de Rollback**:

1. Desabilitar a feature flag via dashboard do serviço de feature flags
2. Reverter o schema do banco usando a down migration
3. Verificar que o sistema retornou ao estado anterior
4. Monitorar taxas de erro para confirmar o sucesso do rollback
```

### ❌ RUIM (Código de Implementação)

````markdown
**Implementação do Serviço**:

```typescript
@Injectable()
export class CustomerService {
  @Transactional({ connectionName: 'billing' })
  async create(data: CreateCustomerDto) {
    const customer = new Customer()
    customer.email = data.email
    return this.repository.save(customer)
  }
}
```
````

### ✅ BOM (Estrutura de Alto Nível)

```markdown
**Camada de Serviços**:

- `CustomerService`: gerencia o ciclo de vida do cliente
  - `create()`: cria cliente, valida unicidade do email
  - `getById()`: busca cliente por ID
  - `updatePaymentMethod()`: atualiza método de pagamento padrão
- Todas as operações de escrita usam transações para garantir consistência
- Os serviços chamam a API externa e cacheiam resultados localmente
```

---

## Anti-Patterns Comuns

### ❌ Definição de Problema Vaga

**RUIM**:

```
Precisamos integrar com o Stripe.
```

**BOM**:

```
### Problemas que Estamos Resolvendo

- **Processamento manual de pagamentos leva 2h/dia**: processamento manual hoje custa R$ 2.500/mês em mão de obra
- **Não conseguimos expandir internacionalmente**: o processador atual só suporta BRL
- **Alto abandono de carrinho (45%)**: UX ruim no checkout causa perda de receita de R$ 50 mil/mês
```

### ❌ Escopo Indefinido

**RUIM**:

```
Construir a integração de pagamento com todas as features.
```

**BOM**:

```
### ✅ Dentro do Escopo (V1)

- Assinaturas com trial (14 dias)
- Um método de pagamento por usuário
- Apenas BRL
- Cancelamento de assinatura

### ❌ Fora do Escopo (V1)

- Múltiplos métodos de pagamento
- Multi-moeda
- Códigos promocionais
- Cobrança por uso (usage-based billing)
```

### ❌ Segurança Ausente em Sistemas de Pagamento

**RUIM**:

```
Sem seção de segurança em uma integração de pagamento.
```

**BOM**:

```
### Considerações de Segurança (OBRIGATÓRIA)

**Compliance PCI DSS**:

- Nunca armazenar números completos de cartão (usar tokens do gateway)
- Nunca logar CVV ou PAN completo
- Usar componentes do gateway para entrada de cartão (PCI SAQ A)

**Gestão de Segredos**:

- Armazenar `STRIPE_SECRET_KEY` em variáveis de ambiente
- Rotacionar chaves a cada 90 dias
- Nunca commitar chaves no git
```

### ❌ Sem Plano de Rollback

**RUIM**:

```
Vamos fazer o deploy e torcer para dar certo.
```

**BOM**:

```
### Plano de Rollback

**Gatilhos**:

- Taxa de erro > 5% → rollback imediato
- Falhas no processamento de pagamento > 10% → rollback imediato

**Passos**:

1. Desabilitar a feature flag `STRIPE_INTEGRATION_ENABLED`
2. Verificar que o processador de pagamento antigo está ativo
3. Notificar #engineering e #product
4. Agendar post-mortem em até 24h
```
