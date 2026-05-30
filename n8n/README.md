# Toromac — Equipo de agentes SEO autónomos

Sistema de **6 agentes** que corren en n8n (instancia self-hosted en Render) y trabajan en bucle para llevar a Toromac al nº1 de su sector en buscadores. Cada agente es un workflow propio; comparten estado vía **Google Sheets** y se notifican por **webhooks internos**, **Telegram** (urgente) y **email** (informes).

## Los 6 agentes

| # | Agente | Workflow | Cron | Misión |
|---|---|---|---|---|
| 1 | **Writer** | `01-writer-agent.json` | Lun y Jue 09:00 (UTC+1) | Genera 2 artículos bilingües por semana (ES+EN, ≥2.000 palabras, FAQ, schema) para keywords del backlog y los publica vía `/api/publish-article`. |
| 2 | **Competitor Analyzer** | `02-competitor-analyzer.json` | Vie 06:00 | Para cada keyword objetivo: SERP → identifica competidores que nos superan → analiza qué hacen mejor → propone acciones para Writer y On-site. |
| 3 | **GSC Monitor** | `03-gsc-monitor.json` | Diario 07:00 (light) + Lun 06:00 (deep) | Lee Search Console API → detecta caídas de cobertura, posición, CTR, Core Web Vitals → alerta y abre tareas. |
| 4 | **On-site SEO Modifier** | `04-onsite-modifier.json` | Triggered (cada 30 min revisa cola) | Pequeños cambios: títulos, meta descriptions, alt, schema, FAQ extra, internal links. Propone diff y lo manda al Reviewer. |
| 5 | **Reviewer adversarial** | `05-reviewer.json` | Webhook (síncrono) | Valida cada propuesta del Modifier antes del merge: build OK, tono editorial, integridad i18n, justificación SEO. Si pasa → auto-merge. Si no → PR + Telegram. |
| 6 | **Monthly Reporter** | `06-monthly-reporter.json` | Día 1 del mes 08:00 | Agrega GA4 + GSC + actividad agentes → informe HTML → email a `marketingesthetico@gmail.com` + alimenta backlog del Writer/Competitor con oportunidades del mes. |

## Bucle de retroalimentación

```
                ┌────────────────────────────────────┐
                │           Google Sheets            │
                │   (única fuente de verdad)         │
                │  • keywords-backlog                │
                │  • competitor-findings             │
                │  • gsc-issues                      │
                │  • seo-changelog                   │
                │  • monthly-reports                 │
                └───────┬────────────────────┬───────┘
                        │                    │
       ┌────────────────┘                    └────────────────┐
       │                                                      │
   ┌───▼────┐    ┌─────────────┐   ┌──────────────┐     ┌────▼────────┐
   │ Writer │◀──▶│ Competitor  │   │ GSC Monitor  │◀───▶│ Monthly     │
   │ (1)    │    │ Analyzer (2)│   │ (3)          │     │ Reporter (6)│
   └───┬────┘    └──────┬──────┘   └───────┬──────┘     └─────────────┘
       │                │                  │
       │                ▼                  ▼
       │         ┌────────────────────────────┐
       │         │   On-site Modifier (4)     │
       │         │   propone diff             │
       │         └────────────┬───────────────┘
       │                      │
       │                      ▼
       │              ┌───────────────┐
       │              │ Reviewer (5)  │  ◀──────  adversarial gate
       │              │  pass / fail  │
       │              └───────┬───────┘
       │                      │
       │              ┌───────┴───────┐
       │              ▼               ▼
       │       /api/seo-tweak   /api/seo-tweak
       │         (automerge)        (PR)
       │
       └────▶ /api/publish-article  ───▶  commit GitHub  ──▶  Vercel deploy
```

## Endpoints del lado web (este repo)

| Endpoint | Quién lo usa | Función |
|---|---|---|
| `/api/publish-article` | Writer | Recibe `{articleEs, articleEn}` y los commitea en `src/data/articles/`. |
| `/api/seo-tweak` | On-site Modifier / Reviewer | Recibe propuesta `{path, content, message, mode: 'automerge' \| 'pr'}` y aplica vía GitHub API (commit a main o PR). |
| `/api/agent-report` | Monthly Reporter | Recibe estructura del informe y envía email HTML vía Resend a `marketingesthetico@gmail.com`. |

Todos los endpoints validan `Authorization: Bearer ${PUBLISH_SECRET}`.

## Convenciones de comunicación entre agentes

- **Estado compartido** → Google Sheets (1 hoja por dominio: backlog, findings, issues, changelog, reports).
- **Notificación inmediata** → webhook a otro workflow (n8n → n8n vía HTTP) cuando un agente abre tarea para otro.
- **Alertas humanas** → Telegram (urgente) y email (informes).
- **Trazabilidad** → cada acción de cualquier agente escribe una fila en `seo-changelog` con timestamp, agente, acción, resultado.

## Setup y operación

Ver:
- [`docs/credentials-checklist.md`](docs/credentials-checklist.md) — todas las claves y cómo obtenerlas
- [`docs/setup.md`](docs/setup.md) — cómo importar los workflows y wirearlos en n8n
- [`docs/operation.md`](docs/operation.md) — cómo pausar/depurar agentes, leer logs, intervenir manualmente
- [`sheet-schemas/`](sheet-schemas/) — schema de cada hoja, copiar tal cual al crear el Google Sheet
