# Workflow 03 — GSC Monitor

**Misión:** vigilar Google Search Console cada día (light scan) y semanalmente en profundidad (deep scan). Detectar errores de cobertura, caídas de posición, CTR bajo, problemas de Core Web Vitals, errores de schema. Alertar y abrir tareas para el On-site Modifier.

**Cron:**
- **Light:** diario 07:00 (UTC+1) — chequea cobertura y errores nuevos.
- **Deep:** lunes 06:00 (UTC+1) — analiza tendencia 7-vs-7 días.

**Credentials:** `Toromac Google` (Search Console API), `Toromac Anthropic` (solo para resumir alertas), `Toromac Telegram`.

---

## Estructura — Light scan diario

```
[1] Cron Trigger (diario)
  ↓
[2] HTTP: GET searchconsole.googleapis.com/v1/sites/{{$env.TOROMAC_GSC_SITE_URL}}/urlInspection/index:inspect
    (Para top 10 URLs estratégicas — definidas en env var TOROMAC_URLS_PRIORITARIAS)
  ↓
[3] Code (JS): detectar URLs con coverageState != "Submitted and indexed"
  ↓
[4] HTTP: GET searchanalytics/query con dimensión "query", últimas 24h vs 7 días anteriores
  ↓
[5] Code: detectar queries con CTR < 1% e impresiones > 50
  ↓
[6] Para cada hallazgo:
    ↓
    [6a] Sheets: append gsc-issues con severidad
    ↓
    [6b] IF severidad == critica → Telegram inmediato + abrir tarea on-site
```

## Estructura — Deep scan semanal

```
[1] Cron Trigger (lunes)
  ↓
[2] HTTP: searchanalytics/query semana actual con dimensiones [query, page]
  ↓
[3] HTTP: searchanalytics/query semana anterior con mismas dimensiones
  ↓
[4] Code (JS): diff posiciones, calcular winners (-Δ pos) y losers (+Δ pos)
  ↓
[5] HTTP: GET PageSpeed Insights API para top 5 páginas (LCP, INP, CLS)
  ↓
[6] Code: detectar páginas con CWV poor (LCP > 4s, INP > 500ms, CLS > 0.25)
  ↓
[7] Anthropic Sonnet: resumir hallazgos + priorizar
  ↓
[8] Sheets: append filas a gsc-issues
  ↓
[9] Sheets: append seo-changelog
  ↓
[10] Telegram: "📊 GSC weekly: <N> losers, <M> CWV issues, <X> opportunities."
```

---

## Variables

```
TOROMAC_URLS_PRIORITARIAS=https://toromac.com/,https://toromac.com/productos,https://toromac.com/productos/elevador-cangilones-tipo-z,https://toromac.com/novedades,https://toromac.com/en,...
TOROMAC_GSC_SITE_URL=sc-domain:toromac.com   (o https://toromac.com/ si se verificó por URL)
```

Acceso en n8n: `{{$env.TOROMAC_URLS_PRIORITARIAS}}` (splittear por coma en un nodo Code).

---

## Severidades — qué se alerta a Telegram inmediatamente

| Tipo | Condición | Severidad |
|---|---|---|
| `COVERAGE` | URL prioritaria con `coverageState != "Submitted and indexed"` | critica |
| `COVERAGE` | URL no prioritaria desindexada | alta |
| `RANKING_DROP` | Query con Δposición > +5 en 7 días Y la URL es top 10 | alta |
| `LOW_CTR` | CTR < 1% con impresiones > 100 | media |
| `CWV` | LCP > 4s o INP > 500ms en página prioritaria | alta |
| `SCHEMA_ERROR` | GSC Rich Results report indica error | media |

`critica` → Telegram + email + tarea on-site con prioridad alta.
`alta` → Telegram + tarea on-site con prioridad media.
`media` → solo Sheets + tarea on-site con prioridad baja.

---

## Nodo [7] — Resumen con Claude Sonnet (deep scan)

**System prompt:**
```
Eres analista SEO senior revisando datos de Search Console de Toromac. Tu salida es un resumen accionable, no descriptivo. Cada hallazgo debe llevar una acción concreta para el equipo on-site o de contenidos.
```

**User prompt (template):**
```
DATOS GSC WEEKLY:

WINNERS (queries que ganan posición):
{{winners_json}}

LOSERS (queries que pierden posición):
{{losers_json}}

CORE WEB VITALS — páginas con problemas:
{{cwv_json}}

COBERTURA — URLs prioritarias no indexadas o con error:
{{coverage_json}}

Genera EXCLUSIVAMENTE este JSON:

{
  "resumen_ejecutivo": "3-4 frases sobre el estado de la semana",
  "issues": [
    {
      "tipo": "RANKING_DROP | LOW_CTR | CWV | COVERAGE | SCHEMA_ERROR",
      "severidad": "critica | alta | media | baja",
      "url_afectada": "...",
      "detalle": "qué pasa, en 1-2 frases técnicas",
      "metrica": "número o cadena relevante",
      "accion_propuesta": "qué debe hacer el On-site, en 1 frase accionable"
    }
  ]
}

Prioriza: si una URL prioritaria pierde >3 posiciones, severidad alta. Si CWV poor en página prioritaria, severidad alta. Si una query con buenas impresiones tiene CTR <1%, severidad media — proponer mejorar title/meta.
```

---

## Encadenamiento al On-site Modifier

Cada `accion_propuesta` que escribe este workflow en `gsc-issues` con `estado=nuevo` es leída por el On-site Modifier en su scan periódico. El On-site decide cómo aplicar el cambio y lo manda al Reviewer.

---

## Notas de implementación

- La cuenta de servicio necesita rol **Reader** en GSC (no Owner). Se añade desde Search Console → Settings → Users and permissions.
- PageSpeed Insights API tiene cuota gratuita generosa, no necesita key separada si se hace anónimo.
- Si la cuenta GSC tiene poco histórico (<28 días), el deep scan saldrá vacío las primeras semanas — normal.
