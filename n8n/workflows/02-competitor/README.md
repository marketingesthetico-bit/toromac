# Workflow 02 — Competitor Analyzer

**Misión:** vigilar semanalmente nuestra posición frente a competidores en las keywords objetivo, identificar dónde nos superan y por qué, y proponer acciones concretas para el Writer (nuevo artículo) o para el On-site Modifier (mejora de página existente).

**Cron:** Viernes 06:00 (UTC+1) — analiza el lote semanal completo.
**Credentials:** `Toromac Google` (Sheets), `Toromac Serper`, `Toromac Anthropic`, `Toromac Vercel API` (opcional, para encadenar al Writer), `Toromac Telegram`.

---

## Estructura

```
[1] Cron Trigger (semanal)
  ↓
[2] Variable: $env.TOROMAC_TARGET_KEYWORDS_ES (lista) + $env.TOROMAC_COMPETITORS (lista de dominios a vigilar)
  ↓
[3] Loop por keyword:
    ↓
    [3a] Serper.dev → POST https://google.serper.dev/search
         Header: X-API-KEY: {{$env.TOROMAC_SERPER_API_KEY}}
         Body JSON: {"q":"{{keyword}}","gl":"es","hl":"es","num":20}
         Respuesta: leer `organic[]`
    ↓
    [3b] Code: identificar posición Toromac + posiciones de cada competidor de la lista
    ↓
    [3c] IF (algún competidor está por encima de Toromac)
       ↓ SI
       [3d] HTTP fetch del contenido del competidor mejor posicionado
       ↓
       [3e] HTTP fetch (si existe) de nuestra URL competidora
       ↓
       [3f] Anthropic (Claude Sonnet): análisis comparativo → JSON con acción propuesta
       ↓
       [3g] Sheets: append fila a competitor-findings
       ↓
       [3h] IF accion_propuesta == NEW_ARTICLE → añade a keywords-backlog con origen=competitor
       ↓
       [3i] IF accion_propuesta == ONSITE_TWEAK → no hace nada aquí; el On-site Modifier lee competitor-findings cada 30 min
  ↓
[4] Sheets: append seo-changelog (resumen del lote)
  ↓
[5] Telegram: "🔍 Competitor scan: <N> keywords revisadas, <X> nuevos hallazgos."
```

---

## Nodo [3f] — Análisis comparativo con Claude Sonnet

**System prompt:**
```
Eres analista SEO de Toromac. Recibes el contenido de una página competidora que nos supera en SERP para una keyword concreta y, si existe, nuestra propia página competidora. Tu salida es un análisis breve y una acción concreta para que el equipo de contenidos cierre el gap. No menciones competidores por nombre en la acción propuesta (sí en el campo `competidor`).
```

**User prompt (template):**
```
KEYWORD: {{keyword}}
POSICION COMPETIDOR: {{posicion_competidor}}
POSICION TOROMAC: {{posicion_toromac}} (o "no aparece en top 20")

URL COMPETIDORA:
{{url_competidor}}

CONTENIDO COMPETIDOR (texto extraído):
{{contenido_competidor}}

NUESTRA URL (si aplica): {{nuestra_url}}
NUESTRO CONTENIDO (si aplica): {{nuestro_contenido}}

Analiza qué diferencia al competidor de nosotros. Devuelve EXCLUSIVAMENTE este JSON:

{
  "analisis": "2-3 frases técnicas sobre qué hace mejor el competidor: longitud, profundidad, estructura, schema, sección que no tenemos, etc. Sin marketing.",
  "diferenciales_clave": ["item 1", "item 2", "item 3"],
  "accion_propuesta": {
    "tipo": "NEW_ARTICLE | ONSITE_TWEAK | NEW_SECTION",
    "descripcion": "instrucción accionable de máximo 2 frases. Si NEW_ARTICLE, qué keyword y ángulo. Si ONSITE_TWEAK, qué archivo/campo y qué cambiar. Si NEW_SECTION, dónde añadirla.",
    "asignado_a": "writer | onsite",
    "prioridad": "alta | media | baja"
  }
}

Criterios para asignar:
- Si nuestra página no existe → NEW_ARTICLE, asignado_a=writer.
- Si nuestra página existe y el competidor tiene una sección/tabla/FAQ que nosotros no → ONSITE_TWEAK o NEW_SECTION, asignado_a=onsite.
- Si la diferencia es solo de longitud o profundidad → ONSITE_TWEAK con instrucción de expandir.
- Prioridad alta solo si: la keyword es high-volume O el gap es claro y replicable rápido.
```

---

## Selección de competidores

La lista `TOROMAC_COMPETITORS` se mantiene como env var en Render. Inicio (basado en SERP real de keywords objetivo):

```
TOROMAC_COMPETITORS=sinfimasa.com,marobera.com,maquinariatadel.com,ulmapackaging.com,rovema.com,grupoegasa.com
```

Se lee en el workflow como `{{$env.TOROMAC_COMPETITORS}}` y se splittea por coma en un nodo Code.

Ajustar según el sector real. Cualquier dominio que aparezca en top 10 para más de 3 de nuestras keywords objetivo debería entrar. La lista se irá actualizando automáticamente cuando el Competitor Analyzer detecte nuevos dominios recurrentes en top 10 — los irá apuntando en `seo-changelog` como candidatos a añadir.

---

## Encadenamiento al Writer

Cuando `accion_propuesta.tipo == NEW_ARTICLE`, este workflow inserta una fila nueva en `keywords-backlog`:

```
keyword_es: <del análisis>
keyword_en: <traducción que el Writer ajustará>
producto_relacionado: <ID inferido del contexto>
prioridad: alta | media (del JSON)
estado: pendiente
origen: competitor
notas: "Detectado por competitor scan {{fecha}}: <url_competidor>"
```

El Writer la cogerá en su próxima ejecución según prioridad.

---

## Output esperado

Cada ejecución semanal: 5-15 filas nuevas en `competitor-findings`, 0-5 nuevas keywords en `keywords-backlog`, 1 fila en `seo-changelog`, 1 mensaje Telegram con resumen.

Si una keyword aparece 4 semanas seguidas con hallazgos sin resolver → escalar prioridad y notificar humano por Telegram.
