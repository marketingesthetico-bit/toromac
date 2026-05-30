# Telegram — helper común

n8n tiene un nodo nativo de Telegram. Cada workflow lo usa para alertas y para confirmaciones. Aquí van las convenciones para que los mensajes sean consistentes y filtrables.

## Credential

`Toromac Telegram` (tipo: Telegram Bot). Bot Token de @BotFather. Todos los nodos usan esta credential.

## Chat ID

`{{TELEGRAM_CHAT_ID}}` como variable global. Para un grupo, el ID es negativo (`-1001234567890`). Para un usuario, positivo.

## Formato de los mensajes

Cada mensaje empieza con un **emoji de estado** y un **prefijo de agente** para que filtres visualmente:

| Emoji | Significado | Cuándo |
|---|---|---|
| ✅ | Éxito / acción completada | Writer publica artículo, On-site auto-mergea |
| ⚠️ | Aviso (requiere atención humana) | PR abierta para revisar, GSC issue alta |
| 🛠️ | Cambio aplicado | On-site automerge OK |
| 🔍 | Análisis completado | Competitor scan semanal |
| 📊 | Datos / scan | GSC deep scan |
| 📈 | Informe | Mensual Reporter |
| 🚨 | Crítico | GSC severidad crítica, workflow falla, build roto |
| ❌ | Error | Cualquier fallo de workflow |

**Prefijo de agente:** `[Writer]`, `[Competitor]`, `[GSC]`, `[On-site]`, `[Reviewer]`, `[Reporter]`.

### Plantillas estándar

**Writer — publicado:**
```
✅ [Writer] Publicado
"<titulo>"
ES: <url_es>
EN: <url_en>
Palabras: <es>/<en>
Producto: <relatedProduct>
```

**Competitor — scan semanal:**
```
🔍 [Competitor] Scan semanal
Keywords revisadas: <N>
Nuevos hallazgos: <X>
Asignados a Writer: <a>
Asignados a On-site: <b>
Top issue: <breve descripción de la más urgente>
```

**GSC — alerta crítica:**
```
🚨 [GSC] CRÍTICO: <tipo>
URL: <url_afectada>
Detalle: <detalle>
Métrica: <valor>
Acción propuesta: <accion_propuesta>
```

**On-site — auto-mergeado:**
```
🛠️ [On-site] Auto-aplicado
<message>
Archivo: <path>
Commit: <commit_url>
```

**On-site — PR para revisar:**
```
⚠️ [On-site] PR para revisar
<message>
PR: <pr_url>
Razón del Reviewer: <comments>
```

**Reporter — mensual:**
```
📈 [Reporter] Informe <mes> enviado
Clicks GSC: <clicks_gsc>
Posición media: <pos_media>
Δ vs mes anterior: <delta>
Oportunidades añadidas al backlog: <N>
Email entregado a marketingesthetico@gmail.com
```

**Cualquier workflow — error:**
```
❌ [<Agent>] Workflow falló
Nodo: <node_name>
Error: <error_message>
Última fila procesada: <id o url si aplica>
Acción: revisar Executions en n8n
```

## Implementación en cada workflow

Cada workflow termina (o entra en su rama de error) en un nodo Telegram con la plantilla correspondiente. Por convención, el último nodo del happy-path se llama `notify-success` y el de error `notify-error`. El nodo de error está conectado al "Error workflow" global de cada workflow.

## Test inicial

Antes de activar workflows, hacer un test manual:
```
🤖 Toromac SEO online — los 6 agentes operativos.
```

Si llega → bot bien configurado.
