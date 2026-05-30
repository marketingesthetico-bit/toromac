# Workflow 04 — On-site SEO Modifier

**Misión:** ejecutar los cambios on-site propuestos por el Competitor Analyzer y el GSC Monitor: títulos, meta descriptions, alt de imágenes, schema JSON-LD, FAQs adicionales, internal linking, expansión de secciones existentes. Cada propuesta pasa SIEMPRE por el Reviewer antes de aplicarse.

**Cron:** cada 30 minutos, lee la cola y procesa tareas pendientes (FIFO con prioridad).
**Credentials:** `Toromac Google` (Sheets), `Toromac GitHub` (lectura del repo), `Toromac Anthropic`, `Toromac Vercel API` (para llamar `/api/seo-tweak`), webhook al workflow Reviewer.

---

## Estructura

```
[1] Cron Trigger (cada 30 min)
  ↓
[2] Sheets read: combina (gsc-issues estado=nuevo) ∪ (competitor-findings estado=pendiente asignado_a=onsite)
  ↓
[3] Code: priorizar por severidad/prioridad, coger 1 tarea (para evitar concurrencia)
  ↓
[4] IF (no hay tarea) → fin
  ↓
[5] Sheets: marcar la tarea estado=en_proceso (lock)
  ↓
[6] HTTP GET GitHub: contents/{{target_file}} en main → contenido actual base64
  ↓
[7] Code: decode base64 → string
  ↓
[8] Anthropic Sonnet: propone diff/contenido nuevo basado en la tarea
  ↓
[9] HTTP POST webhook → Workflow 05 Reviewer con {path, current_content, new_content, message, reason, agent: "onsite"}
  ↓
[10] Espera response síncrona del Reviewer: { verdict: "pass" | "fail", comments }
  ↓
[11] IF verdict == "pass":
       ↓
       [11a] HTTP POST /api/seo-tweak con mode="automerge"
       ↓
       [11b] Sheets: marcar tarea estado=hecho, fecha_resolucion=ahora
       ↓
       [11c] Sheets append seo-changelog (onsite, automerge, commit_sha)
       ↓
       [11d] Telegram: "🛠️ Auto-aplicado: <message> · <commit_url>"
    IF verdict == "fail":
       ↓
       [11e] HTTP POST /api/seo-tweak con mode="pr"
       ↓
       [11f] Sheets: marcar tarea estado=pendiente_revision_humana, notas={{comments}}
       ↓
       [11g] Sheets append seo-changelog (onsite, pr, pr_url, comments del Reviewer)
       ↓
       [11h] Telegram: "⚠️ PR para revisar: <pr_url> · razón: {{comments}}"
```

---

## Tipos de cambio que sabe hacer

| Tipo de tarea | Archivos típicos | Cómo lo propone |
|---|---|---|
| Mejorar title o meta description | `src/data/products/products.json`, `src/data/articles/<lang>/<slug>.json`, `src/locales/<lang>.json` | Reescribe el campo `seo.<lang>.title` o `seo.<lang>.description` |
| Añadir FAQ a un artículo | `src/data/articles/<lang>/<slug>.json` | Añade entrada al array `faq` |
| Mejorar alt de imagen | `src/data/products/products.json` | Reescribe `imageAlt.<lang>` |
| Añadir internal link | `src/data/articles/<lang>/<slug>.json` | Añade un bloque `p` con referencia interna (texto, no HTML) |
| Expandir sección existente | `src/data/articles/<lang>/<slug>.json` | Inserta bloques nuevos antes/después de un H2 existente |
| Añadir entrada a categoría | `src/data/products/categories.json` | Reescribe `seoTitle`/`seoDescription`/`description` |

Lo que **NO** hace este agente (escalar a humano):
- Cambios en componentes React (`.jsx`).
- Cambios estructurales en rutas o navegación.
- Cambios en `api/` o `vercel.json`.
- Borrar contenido existente (solo añade o reescribe el mismo campo).
- Cambios masivos (>3 archivos en una tarea).

Estas restricciones las refuerza el Reviewer.

---

## Nodo [8] — Propuesta con Claude Sonnet

**System prompt:**
```
Eres ingeniero on-site SEO de Toromac. Recibes una tarea concreta (de GSC o del análisis de competidores), el archivo actual del repo, y debes devolver el contenido completo del archivo MODIFICADO con el cambio aplicado. NUNCA devuelves un diff; devuelves el archivo completo. Mantén el tono editorial clínico-técnico de Toromac (CLAUDE.md §9). No introduces emoji, no cambias el orden ni estructura de campos existentes salvo lo justo. Si la tarea pide algo fuera de los tipos permitidos, devuelves un JSON {"escalar": "humano", "motivo": "..."}.
```

**User prompt (template):**
```
TAREA:
{{tarea_json}}    // incluye tipo, descripcion, severidad, accion_propuesta

ARCHIVO ACTUAL: {{target_file}}
CONTENIDO ACTUAL:
{{current_content}}

INSTRUCCIONES:
- Devuelve el archivo COMPLETO con el cambio aplicado.
- Si es JSON, devuelve solo JSON válido. Si es .html/.jsx, devuelve solo el archivo.
- No añadas comentarios explicativos en el contenido salvo que sean parte natural del archivo (en JSX, comentarios técnicos están permitidos).
- Si la tarea pide algo que NO está en los tipos permitidos arriba, responde EXCLUSIVAMENTE:
  {"escalar":"humano","motivo":"explicación breve"}
- Mantén el tono clínico-técnico: sin marketing, sin emoji, sin exclamaciones, sin segundas personas afectivas.

Tipos permitidos:
- Editar campos seo.title, seo.description, metaDescription en JSON de productos/artículos.
- Añadir entrada al array faq[] de artículo.
- Editar imageAlt en producto.
- Añadir bloque a content.<lang> en artículo (tipo p, h2, ul, callout o table).
- Editar seoTitle/seoDescription/description de categoría.

Devuelve el archivo completo, listo para commitear.
```

Si la respuesta empieza por `{"escalar":"humano"`, el workflow salta directamente al paso de notificación humana sin pasar por el Reviewer.

---

## Concurrencia y locking

El sistema usa un lock optimista en Sheets: el agente marca la fila como `en_proceso` antes de procesarla. Si dos ejecuciones del workflow coincidieran (no debería con cron de 30 min), la segunda verá `en_proceso` y la saltará.

Si una tarea queda en `en_proceso` más de 1h sin resolverse (fallo de workflow), se considera "huérfana"; un job de saneamiento (o intervención manual) la pasa a `pendiente`.

---

## Output esperado

Por ejecución: 0-1 cambio aplicado (automerge o PR). Volumen típico semanal: 5-20 cambios on-site, mayoría automerge (si el Reviewer los aprueba).
