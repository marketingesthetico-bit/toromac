# Google Sheet — esquema de las 5 pestañas

Una única hoja de cálculo con 5 pestañas. Comparte la hoja con el email del service account (rol Editor). El `TOROMAC_SHEET_ID` (env var en Render) es la única variable que los workflows necesitan; cada agente sabe qué pestaña usar.

## Pestaña 1: `keywords-backlog`

Backlog de keywords objetivo. El Writer lee la siguiente fila con `estado = pendiente`.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | número | Autoincremental |
| `keyword_es` | texto | Keyword principal ES |
| `keyword_en` | texto | Keyword principal EN |
| `intencion` | texto | informational / commercial / navigational |
| `volumen_estimado` | número | Búsquedas/mes (orientativo) |
| `dificultad` | número | 0–100 (orientativo) |
| `producto_relacionado` | texto | ID de producto en `src/data/products/products.json` |
| `prioridad` | texto | alta / media / baja |
| `estado` | texto | pendiente / en_proceso / publicado / descartada |
| `url_es` | texto | URL del artículo publicado (se rellena al publicar) |
| `url_en` | texto | URL EN |
| `fecha_publicacion` | fecha | ISO |
| `palabras_es` | número | Recuento real |
| `palabras_en` | número | Recuento real |
| `origen` | texto | manual / reporter / competitor (quién la propuso) |
| `notas` | texto | Libre |

## Pestaña 2: `competitor-findings`

Hallazgos del Competitor Analyzer. El On-site Modifier los lee como cola de trabajo.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | número | Autoincremental |
| `fecha` | fecha | ISO de detección |
| `keyword` | texto | Keyword analizada |
| `competidor` | texto | Dominio que nos supera |
| `posicion_competidor` | número | 1–10 |
| `posicion_toromac` | número | Nuestra posición actual |
| `nuestra_url` | texto | URL de Toromac que compite (o vacío si no hay) |
| `analisis` | texto | Qué hace mejor (longitud, estructura, schema, etc.) |
| `accion_propuesta` | texto | Texto libre + categoría: NEW_ARTICLE / ONSITE_TWEAK / NEW_SECTION |
| `asignado_a` | texto | writer / onsite |
| `estado` | texto | pendiente / en_proceso / hecho / descartado |
| `fecha_resolucion` | fecha | ISO |

## Pestaña 3: `gsc-issues`

Hallazgos del GSC Monitor. Los críticos disparan Telegram y abren tarea inmediata al On-site.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | número | Autoincremental |
| `fecha` | fecha | ISO |
| `tipo` | texto | COVERAGE / RANKING_DROP / LOW_CTR / CWV / SCHEMA_ERROR |
| `severidad` | texto | critica / alta / media / baja |
| `url_afectada` | texto | URL del problema |
| `detalle` | texto | Descripción del problema |
| `metrica` | texto | Valor numérico relevante (clicks, posición, LCP, etc.) |
| `accion_propuesta` | texto | Qué debe hacer el On-site |
| `estado` | texto | nuevo / en_proceso / resuelto / ignorado |
| `fecha_resolucion` | fecha | ISO |

## Pestaña 4: `seo-changelog`

Log inmutable de toda acción de cualquier agente. Trazabilidad para auditoría.

| Columna | Tipo | Descripción |
|---|---|---|
| `timestamp` | datetime | ISO |
| `agente` | texto | writer / competitor / gsc / onsite / reviewer / reporter |
| `accion` | texto | Qué hizo |
| `target` | texto | URL o path afectado |
| `commit_sha` | texto | Si la acción generó commit |
| `pr_url` | texto | Si abrió PR |
| `resultado` | texto | success / blocked / failed |
| `payload` | texto | JSON breve para debugging |

## Pestaña 5: `monthly-reports`

Resumen mensual generado por el Reporter. El Writer y Competitor leen el más reciente como input del siguiente ciclo.

| Columna | Tipo | Descripción |
|---|---|---|
| `mes` | texto | YYYY-MM |
| `clicks_total` | número | GA4 visitas orgánicas |
| `impresiones_gsc` | número | GSC impresiones |
| `clicks_gsc` | número | GSC clicks |
| `ctr_medio` | número | % |
| `posicion_media` | número | GSC |
| `top_5_paginas` | texto | URLs separadas por `|` |
| `top_5_queries_ganan` | texto | Queries que subieron en posición |
| `top_5_queries_pierden` | texto | Queries que bajaron |
| `oportunidades_keywords` | texto | Keywords con impresiones pero baja posición — input para Writer |
| `articulos_publicados` | número | En el mes |
| `cambios_onsite` | número | En el mes |
| `issues_gsc_resueltas` | número | En el mes |
| `email_enviado` | bool | true si Resend confirmó envío |

## Plantilla rápida

Si prefieres copiar de golpe, crea una nueva Google Sheet, pon las cabeceras de arriba en 5 pestañas con esos nombres exactos, y comparte con el service account. Listo.
