# Workflow 06 — Monthly Reporter

**Misión:** el día 1 de cada mes, generar el informe mensual de rendimiento SEO: agregar GA4 + GSC + actividad de los demás agentes en el Sheet, enviarlo por email a `marketingesthetico@gmail.com`, y dejar resumen en el Sheet `monthly-reports` que el Writer y Competitor consumirán como input del siguiente ciclo.

**Cron:** Día 1 de cada mes a las 08:00 (UTC+1).
**Credentials:** `Toromac Google` (Sheets + GA4 Data API + GSC API), `Toromac Vercel API` (para llamar `/api/agent-report`), `Toromac Anthropic` (para el resumen ejecutivo opcional), `Toromac Telegram`.

---

## Estructura

```
[1] Cron Trigger (día 1 del mes)
  ↓
[2] Code: calcular rango del mes pasado (start, end ISO)
  ↓
[3] HTTP: GA4 Data API runReport (métricas: sessions, totalUsers, screenPageViews) dimensión: pagePath, filtros sessionSource=google sessionMedium=organic
  ↓
[4] HTTP: GSC searchanalytics/query (dimensions: query, page) últimas 28 días
  ↓
[5] HTTP: GSC searchanalytics/query mes anterior (para el delta)
  ↓
[6] Sheets: leer keywords-backlog, competitor-findings, gsc-issues, seo-changelog (filtros por mes)
  ↓
[7] Code: agregar todo en una estructura common
  ↓
[8] Anthropic Sonnet (opcional): generar resumen ejecutivo de 3-4 frases
  ↓
[9] HTTP POST → https://toromac.com/api/agent-report (Bearer) con el payload
  ↓
[10] Sheets: append monthly-reports
  ↓
[11] Code: derivar "oportunidades_keywords" (queries con impresiones > 200 y posición > 8) → escribir en keywords-backlog con origen=reporter, prioridad=alta
  ↓
[12] Sheets append seo-changelog
  ↓
[13] Telegram: "📈 Informe mensual {{mes}} enviado. {{N}} oportunidades añadidas al backlog."
```

---

## Nodo [7] — Estructura del payload (Code JS)

```js
const payload = {
  month: '2026-05',
  summary: {
    clicks_total: <GA4 sessions>,
    impresiones_gsc: <GSC sum impressions>,
    clicks_gsc: <GSC sum clicks>,
    ctr_medio: <GSC ctr>,
    posicion_media: <GSC position>,
    articulos_publicados: <count seo-changelog where agente=writer accion=publicar>,
    cambios_onsite: <count seo-changelog where agente=onsite resultado=success>,
    issues_gsc_resueltas: <count gsc-issues estado=resuelto in month>,
  },
  top_pages: [<top 10 GA4 by pageViews>],
  queries_gain: [<top 10 by negative delta position>],
  queries_loss: [<top 10 by positive delta position>],
  opportunities: [<queries with impressions > 200 and position > 8>],
  alerts: [<gsc-issues estado=nuevo or en_proceso, severidad >= alta>],
};
return [{ json: payload }];
```

---

## Nodo [8] — Resumen ejecutivo (opcional)

**System prompt:**
```
Eres analista SEO de Toromac. Escribes el resumen ejecutivo del informe mensual en español técnico-clínico, 3-4 frases, sin marketing. Lo lee el responsable de marketing/dirección.
```

**User prompt (template):**
```
DATOS DEL MES:
{{payload_json}}

Escribe 3-4 frases:
1. Estado general del mes (clicks, impresiones, posición media — destaca cambios respecto a histórico si aportas).
2. Lo más relevante (mayor ganancia o mayor pérdida).
3. Foco del siguiente mes (qué oportunidades han entrado al backlog del Writer).
Sin adjetivos de marketing. Hechos y números.
```

Esta frase se inserta como `summary.executive` en el payload antes de enviar.

---

## Bucle de retroalimentación

Cada mes, el Reporter NO solo informa: también actúa sobre el backlog del Writer y del Competitor:

1. **Oportunidades a Writer.** Queries con buenas impresiones (>200) y posición mejorable (>8) → se añaden a `keywords-backlog` con `origen=reporter`, `prioridad=alta`. El Writer las cogerá en sus próximas ejecuciones.

2. **Queries perdedoras a Competitor.** Las queries con mayor caída de posición se etiquetan en `competitor-findings` como `prioridad=alta` para análisis profundo la siguiente semana.

3. **Issues no resueltas a On-site.** Si quedaron issues `gsc-issues` sin resolver del mes pasado, su prioridad sube automáticamente.

Esto cierra el círculo: el sistema aprende de su propio rendimiento.

---

## Template del email

El render HTML lo hace el endpoint `/api/agent-report` (ver `api/agent-report.js`). El workflow solo le pasa el payload JSON. Resend envía a `marketingesthetico@gmail.com` desde el sender verificado de Toromac.

---

## Output esperado

Cada día 1 a las 08:00:
- 1 email a `marketingesthetico@gmail.com`.
- 1 fila nueva en `monthly-reports`.
- 1-15 filas nuevas en `keywords-backlog` (oportunidades del mes).
- 1 mensaje Telegram con resumen.

Si el GA4 o el GSC devuelven datos vacíos (primer mes, sin tráfico aún) → el informe sale con valores 0 y comentario explícito; no falla.
