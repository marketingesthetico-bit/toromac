# Setup — del repo en blanco a 6 agentes funcionando

Sigue este orden. Cada paso es independiente del siguiente salvo que se indique.

## 1. Credenciales

Ver [`credentials-checklist.md`](credentials-checklist.md). Configura primero las **Críticas** en n8n y en Vercel.

## 2. Crear el Google Sheet de estado compartido

1. Nueva hoja de cálculo en Google Drive.
2. Crear 5 pestañas con los nombres exactos: `keywords-backlog`, `competitor-findings`, `gsc-issues`, `seo-changelog`, `monthly-reports`.
3. Copiar las cabeceras de [`../sheet-schemas/README.md`](../sheet-schemas/README.md) en la primera fila de cada pestaña.
4. Compartir la hoja con el email del service account (Editor).
5. Anotar el `SHEET_ID` (de la URL).

## 3. Rellenar el backlog inicial

En la pestaña `keywords-backlog`, añade las keywords de partida. Como referencia, las de **CLAUDE.md §11** (las primarias por producto), una por fila, todas con `estado = pendiente`. Asigna `prioridad = alta` a las 5 más estratégicas — el Writer las cogerá primero.

## 4. Variables de entorno en Vercel

En el dashboard de Vercel del proyecto Toromac, añadir las nuevas:
- `VITE_GA_ID` (público, expuesto al cliente)
- `VITE_GSC_VERIFICATION` (público) o verificar GSC por DNS y dejar vacío
- `PUBLISH_SECRET` (privado, mismo valor en n8n)
- `GITHUB_TOKEN` (privado)
- `GITHUB_REPO` (ya estaba)

Reploiar para que los `VITE_` lleguen al cliente.

## 5. Importar los 6 workflows en n8n

Por cada carpeta `workflows/0X-*/`:
1. Abrir n8n → "Import from File" o construir desde el `README.md` del workflow.
2. Wirearles las **credentials**: cada nodo de Anthropic/OpenAI/Sheets/HTTP usa una credential nombrada (ver inicio de cada README).
3. **No activar** todavía. Quedan en modo manual hasta que pasen el test del paso 6.

## 6. Tests E2E manualmente, uno por uno

| Workflow | Test mínimo |
|---|---|
| 01 Writer | Ejecutar manualmente con una keyword de prueba (`prioridad = alta`). Verificar que aparece el artículo en `toromac.com/novedades/<slug>` tras el build. |
| 02 Competitor | Ejecutar para una keyword. Verificar fila nueva en `competitor-findings`. |
| 03 GSC Monitor | Ejecutar manual deep. Verificar lectura de GSC API y al menos un log en `seo-changelog`. |
| 04 On-site Modifier | Inyectar una tarea de prueba en `competitor-findings`. Verificar que llama al Reviewer. |
| 05 Reviewer | Ejecutar con un payload de cambio. Verificar verdict pass/fail correcto. |
| 06 Monthly Reporter | Ejecutar manual. Verificar email a `marketingesthetico@gmail.com` y fila en `monthly-reports`. |

## 7. Activar y dejar en producción

Solo cuando los 6 pasan el test E2E:
1. Activar los crons en n8n.
2. Configurar Telegram bot y verificar primer mensaje "Toromac SEO online".
3. Anotar en `seo-changelog` la fecha de puesta en marcha.

## 8. Auditoría inicial

Una vez todo activo:
- Lighthouse en home, una ficha de producto y un artículo (objetivo ≥95 en las 4 categorías).
- GSC: enviar sitemap `https://toromac.com/sitemap.xml`.
- Validar JSON-LD con [validator.schema.org](https://validator.schema.org/) en las páginas principales.

## Convención de credentials en n8n

Para que los workflows se entiendan entre sí, usa estos **nombres exactos** al crear las credentials en n8n:

| Credential | Tipo n8n |
|---|---|
| `Toromac Anthropic` | Anthropic API |
| `Toromac OpenAI` | OpenAI API |
| `Toromac GitHub` | HTTP Header Auth (`Authorization: Bearer <PAT>`) |
| `Toromac SerpAPI` | Header Auth o Query Auth con la key |
| `Toromac Google` | Google Service Account (cubre Sheets, GA4, GSC) |
| `Toromac Vercel API` | HTTP Header Auth (`Authorization: Bearer <PUBLISH_SECRET>`) |
| `Toromac Telegram` | Telegram (bot token) |

Los specs de cada workflow asumen estos nombres.
