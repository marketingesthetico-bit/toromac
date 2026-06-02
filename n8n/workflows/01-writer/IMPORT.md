# Cómo importar el Writer en n8n — paso a paso

## 1. Borra el workflow vacío anterior (si existe)

Si en tu n8n quedó el `Toromac · 01 Writer Agent` que empezamos a construir manualmente (solo tiene el Schedule Trigger):

1. **Personal → Workflows**.
2. Click en los `···` del workflow → **Delete**.
3. Confirma.

## 2. Importa el JSON

**Opción A — Drag & drop (más rápido):**
1. Abre `n8n/workflows/01-writer/workflow.json` del repo en tu explorador de archivos.
2. En n8n → **Personal → Workflows** → arrastra el archivo `workflow.json` sobre la zona de workflows.
3. Se crea automáticamente el workflow con todos los nodos.

**Opción B — Ctrl+V sobre el canvas:**
1. Abre el archivo `workflow.json` en un editor.
2. Copia su contenido entero (`Ctrl+A` → `Ctrl+C`).
3. En n8n → **Create workflow** (uno vacío).
4. Sobre el canvas vacío → `Ctrl+V`.
5. Aparecen los 13 nodos.

**Opción C — Import from URL (si tienes el repo público):**
1. Personal → Workflows → menú `···` arriba a la derecha → **Import from URL** o **Import from file**.
2. Selecciona el archivo `workflow.json`.

## 3. Rebindea las credentials (4 nodos a revisar)

Tras importar, n8n marcará algunos nodos con un warning amarillo porque las referencias `PENDING_REBIND` no son IDs válidos en tu instancia. Es esperado.

Abre cada uno de estos 4 nodos y selecciona la credential correcta del dropdown:

| Nodo | Credential a seleccionar |
|---|---|
| **Read Backlog (pendiente)** | `Toromac Google` |
| **Lock Row (en_proceso)** | `Toromac Google` |
| **Write Bilingual Article (Claude Sonnet)** | `Toromac Anthropic` |
| **Mark Published** | `Toromac Google` |
| **Append Changelog** | `Toromac Google` |
| **Telegram Success** | `Toromac Telegram` |

Para cada uno:
1. Click en el nodo → se abre el panel de configuración.
2. En la sección **Credentials** (arriba del panel), abrir el dropdown.
3. Seleccionar el nombre correcto de la tabla.
4. Cerrar el panel (`Esc` o X).

## 4. Verificación visual

Antes de ejecutar:

- [ ] Los 13 nodos están conectados en línea recta (Schedule Trigger → Read Backlog → Pick Top → IF → Lock → SERPer → Parse SERP → Write → Parse Article → POST → Mark Published → Changelog → Telegram).
- [ ] Ningún nodo tiene el icono rojo de error.
- [ ] Las 6 credentials están seteadas (no hay warning amarillo).
- [ ] El workflow se llama `Toromac · 01 Writer Agent`.
- [ ] Estado: **Inactive** (NO lo actives todavía).

## 5. Test E2E manual

1. Asegúrate que en la Sheet `keywords-backlog` hay al menos una fila con `estado = pendiente` (preferiblemente la de `elevador de cangilones tipo z`).
2. En el workflow → botón naranja abajo **Execute workflow**.
3. Verás los nodos ejecutándose en cascada. Cada uno tarda:
   - Schedule Trigger: instantáneo
   - Read Backlog: 1s
   - Pick Top, IF, Lock: instantáneo
   - SERPer: 1-2s
   - Parse SERP: instantáneo
   - **Write Bilingual Article (Claude Sonnet): 30-120 segundos** (es el cuello)
   - Parse Article JSON: instantáneo
   - POST /api/publish-article: 2-5s (depende de GitHub API)
   - Mark Published, Changelog, Telegram: 1-2s cada uno
4. Si todo va bien, llega un mensaje a Telegram tipo `✅ [Writer] Publicado...`
5. Tras ~30-60s del POST exitoso, Vercel termina el build y el artículo está live en `toromac.com/novedades/<slug>`.

## 6. Si algún nodo falla

| Nodo que falla | Causa probable | Acción |
|---|---|---|
| Read Backlog | Sheet no compartida con service account, o nombre de pestaña incorrecto | Compartir con email del SA / revisar nombre exacto `keywords-backlog` |
| SERPer | API key inválida o sin créditos | Verificar `TOROMAC_SERPER_API_KEY` en Render y créditos en serper.dev |
| Write Bilingual Article | Sin créditos Anthropic, prompt truncado, JSON mal formado | Revisar saldo Anthropic; output del modelo en logs |
| Parse Article JSON | Claude devolvió texto con markdown o explicación extra | El nodo Code tolera fences ```json y texto alrededor; si falla, ver output del nodo Write |
| POST /api/publish-article | Bearer incorrecto, GitHub PAT sin scope `repo` | Verificar `TOROMAC_PUBLISH_SECRET` = el de Vercel; PAT con scope `repo` |
| Mark Published / Changelog | Same as Read Backlog | Misma solución |
| Telegram | Bot no en grupo, chat_id mal | Verificar `TOROMAC_TELEGRAM_CHAT_ID` |

## 7. Cuando E2E pase

- En la Sheet `keywords-backlog` la fila debería estar como `estado=publicado` con `url_es`, `url_en` y `fecha_publicacion` rellenas.
- En la Sheet `seo-changelog` hay una nueva fila del Writer.
- En Telegram llegó el mensaje.
- En `https://toromac.com/novedades/<slug>` el artículo está live (tras el build Vercel).

Reporta resultado y pasamos a los workflows 02-06 (los genero usando este JSON como template).

## Notas técnicas

- **Modelo Claude usado:** `claude-sonnet-4-5-20250929` (el más nuevo a fecha del JSON).
- **Por qué un único modelo en v1:** simplificación. Una sola llamada bilingüe en lugar de 4 (brief + ES + EN + review). Una vez validado E2E, se pueden añadir nodos de OpenAI para brief y revisión SEO, mejorando calidad.
- **Sin OpenAI en v1:** los specs del README mencionan GPT-4o-mini para brief y revisión. En v1 se omiten para minimizar puntos de fallo. Cuando E2E pase, añadimos.
- **Coste estimado por ejecución v1:** ~$0.30-0.50 USD (1 llamada Claude Sonnet a ~16k tokens). En producción con 2x/sem × 4 sem = ~$4-8/mes.
