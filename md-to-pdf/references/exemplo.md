# Relatório Técnico: Sistema de Gestão HESK

**Departamento de Informática**  
Goiânia - 2024

---

## Sumário Executivo

Este documento descreve a implementação de um pipeline analítico completo para o sistema HESK da OSCEIA, incluindo coleta de dados, processamento e visualização em tempo real.

## 1. Introdução

### Contexto

O sistema HESK (Help Desk) é crítico para as operações da OSCEIA. A necessidade de análises estratégicas sobre tempo de resposta, taxa de resolução e distribuição de demandas motivou o desenvolvimento de uma solução integrada de analytics.

### Objetivos

- ✓ Extrair dados históricos do HESK incrementalmente
- ✓ Processar métricas de horário comercial
- ✓ Apresentar dashboards em tempo real
- ✓ Identificar gargalos operacionais

## 2. Arquitetura da Solução

### Componentes Principais

| Componente | Tecnologia | Função |
|-----------|-----------|--------|
| **Coleta** | Python + SQL | Scraper incremental HESK |
| **Armazenagem** | PostgreSQL 15 | Persistência de dados estruturados |
| **Transformação** | Pandas + NumPy | Processamento de métricas |
| **Visualização** | Grafana v13 | Dashboards interativos |
| **Orquestração** | Docker Compose | Containerização e deploy |

### Fluxo de Dados

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   HESK DB   │─────→│  Scraper Py  │─────→│  PostgreSQL  │
│             │      │              │      │              │
└─────────────┘      └──────────────┘      └──────┬───────┘
                                                  │
                                                  ↓
                                          ┌──────────────┐
                                          │   Grafana    │
                                          │ Dashboards   │
                                          └──────────────┘
```

## 3. Implementação Técnica

### 3.1 Scraper de Dados

O scraper incrementa a coleta de forma segura:

```python
def hesk_scraper_incremental(db_connection, last_sync):
    """
    Coleta tickets desde a última sincronização.
    
    Args:
        db_connection: Conexão com HESK DB
        last_sync: Timestamp da última coleta
    
    Returns:
        List[Dict] com tickets novos/atualizados
    """
    query = """
        SELECT * FROM tickets 
        WHERE lastUpdate > ?
        ORDER BY ticketid ASC
    """
    return db_connection.execute(query, (last_sync,)).fetchall()
```

### 3.2 Processamento de Métricas

As métricas de horário comercial são calculadas conforme regra:

> **Horário Comercial**: Segunda a Sexta, 08h00 às 18h00, excluindo feriados brasileiros.

```python
import pandas as pd
from datetime import timedelta

def calcular_tempo_comercial(ticket):
    """Calcula tempo de resposta em horas comerciais."""
    created = pd.to_datetime(ticket['created_at'])
    responded = pd.to_datetime(ticket['responded_at'])
    
    horas_comerciais = 0
    data_atual = created
    
    while data_atual < responded:
        if eh_dia_util(data_atual) and eh_horario_comercial(data_atual):
            horas_comerciais += 1
        data_atual += timedelta(hours=1)
    
    return horas_comerciais
```

### 3.3 Schema PostgreSQL

```sql
CREATE TABLE chamados (
    id SERIAL PRIMARY KEY,
    ticket_id INT UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50),
    prioridade INT,
    tempo_resposta_horas NUMERIC(8,2),
    criado_em TIMESTAMP DEFAULT NOW(),
    respondido_em TIMESTAMP,
    fechado_em TIMESTAMP,
    CONSTRAINT fk_status CHECK (status IN ('aberto', 'respondido', 'fechado'))
);

CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_criado ON chamados(criado_em);
```

## 4. Resultados e Métricas

### Performance Inicial

A solução foi validada com dados históricos de 6 meses:

| Métrica | Valor |
|---------|-------|
| Tickets Processados | 3.847 |
| Tempo Médio de Resposta | 4h 32min |
| Taxa de SLA (< 4h) | 62% |
| Tempo de Processamento | 8s |

### Gargalos Identificados

1. **Fila Administrativa**: Picos de volume nos períodos 09-10h
2. **Recursos Limitados**: Fim de mês apresenta 3.2x volume padrão
3. **Escalação Deficiente**: Tickets críticos aguardam reclassificação

## 5. Recomendações

### Curto Prazo (< 30 dias)

- [ ] Implantar alertas no Grafana para SLA
- [ ] Treinar time em priorização
- [ ] Revisar fluxo de escalação

### Médio Prazo (30-90 dias)

- [ ] Implementar bot para tickets repetitivos
- [ ] Automatizar reclassificação por palavras-chave
- [ ] Criar base de conhecimento integrada

### Longo Prazo (> 90 dias)

- [ ] Avaliar modelo de atendimento multicanal
- [ ] Implementar AI para análise de sentimento
- [ ] Integrar com sistemas de CRM

## 6. Conclusão

A implementação de um pipeline de analytics para HESK fornece visibilidade operacional completa, possibilitando tomada de decisão estratégica baseada em dados reais.

---

### Apêndice A: Referências

- **Pandoc Docs**: https://pandoc.org/
- **PostgreSQL 15**: https://www.postgresql.org/docs/15/
- **Grafana API**: https://grafana.com/docs/grafana/latest/developers/http_api/

### Apêndice B: Contatos

- **TI Coordenador**: desenvolvimento@osceia.org.br
- **Suporte Técnico**: suporte@osceia.org.br
