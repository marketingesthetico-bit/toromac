# Credenciales y variables — checklist

Todas estas claves se configuran como **Credentials** en n8n (no como variables de entorno en código). Las que también necesita el backend de Vercel están marcadas con (vercel).

## Críticos para arrancar workflows

| Clave | Dónde obtenerla | Dónde se usa |
|---|---|---|
| `GITHUB_TOKEN` (vercel + n8n) | github.com → Settings → Developer Settings → Personal Access Token, scope `repo` | `api/publish-article`, `api/seo-tweak`, Workflows 1 y 4 |
| `GITHUB_REPO` (vercel + n8n) | `marketingesthetico-bit/toromac` (ya configurado) | mismos |
| `PUBLISH_SECRET` (vercel + n8n) | Genera con `openssl rand -hex 32` o cualquier UUID v4 | Bearer de los 3 endpoints |
| `ANTHROPIC_API_KEY` (n8n) | console.anthropic.com → API Keys | Writer (redacción), Competitor (análisis), Reviewer (validación), On-site (propuestas) |
| `OPENAI_API_KEY` (n8n) | platform.openai.com → API keys | Writer (briefs), revisión SEO ligera |
| `SERPER_API_KEY` (n8n) | [serper.dev](https://serper.dev) → Dashboard → API Key | Writer, Competitor Analyzer |

## Google APIs (1 service account cubre las 3)

1. Crear proyecto en Google Cloud Console.
2. Habilitar: **Google Analytics Data API**, **Google Search Console API**, **Google Sheets API**.
3. Crear **service account** → generar **JSON key**.
4. Compartir el Google Sheet con el email del service account (rol Editor).
5. Añadir el service account como usuario delegado en Search Console (rol Lectura).
6. Conceder al service account permisos de lectura en GA4 (Admin → Property Access).

| Clave | Dónde obtenerla |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON descargado del paso 3 |
| `GA4_PROPERTY_ID` | GA4 → Admin → Property Settings (formato: `123456789`) |
| `GA4_MEASUREMENT_ID` (vercel) | GA4 → Admin → Data Streams → Web (formato: `G-XXXXXXXX`) |
| `GSC_SITE_URL` | URL del recurso verificado en Search Console (ej. `sc-domain:toromac.com` o `https://toromac.com/`) |
| `SHEET_ID` | URL del Sheet: `docs.google.com/spreadsheets/d/SHEET_ID/edit` |

## Telegram (alertas)

1. Hablar con [@BotFather](https://t.me/BotFather) en Telegram → `/newbot` → seguir pasos → obtener **Bot Token**.
2. Crear grupo (o usar chat directo). Añadir el bot al grupo.
3. Enviar un mensaje cualquiera al grupo.
4. Visitar `https://api.telegram.org/botBOT_TOKEN/getUpdates` y copiar el `chat.id` (puede ser negativo para grupos).

| Clave | Origen |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Paso 1 |
| `TELEGRAM_CHAT_ID` | Paso 4 |

## Email — Resend (ya configurado)

| Clave | Estado |
|---|---|
| `RESEND_API_KEY` (vercel) | ✅ Ya en .env.local |
| `SENDER_EMAIL` (vercel) | ✅ Ya configurado (dominio verificado en Resend) |
| `CONTACT_EMAIL` (vercel) | ✅ Ya configurado (destino interno) |
| Destino del Monthly Reporter | `marketingesthetico@gmail.com` (hardcoded en el endpoint) |

## Variables de configuración del sistema

Definir como n8n Variables (no Credentials):

| Variable | Valor recomendado |
|---|---|
| `SITE_URL` | `https://toromac.com` |
| `API_BASE` | `https://toromac.com/api` |
| `COMPETITORS` | Lista separada por comas — pendiente de tu input |
| `TARGET_KEYWORDS_ES` | Las de CLAUDE.md §11 + ampliación que generemos |
| `TARGET_KEYWORDS_EN` | Las de CLAUDE.md §11 EN + ampliación |

## Checklist de verificación final

Antes de activar workflows en producción:
- [ ] Endpoint `/api/publish-article` responde 401 sin Bearer y 200 con Bearer correcto en un payload de prueba.
- [ ] Endpoint `/api/seo-tweak` igual.
- [ ] Endpoint `/api/agent-report` envía un email de prueba a `marketingesthetico@gmail.com`.
- [ ] Bot de Telegram responde con un mensaje de "Toromac SEO online" enviado manualmente.
- [ ] Service account tiene acceso GA4, GSC y al Sheet (verificar leyendo una métrica de prueba).
- [ ] Serper.dev key tiene créditos disponibles y devuelve resultados para una keyword test (verificar con `curl -X POST https://google.serper.dev/search -H "X-API-KEY: <key>" -H "Content-Type: application/json" -d '{"q":"elevador cangilones tipo z","gl":"es","hl":"es","num":3}'`).
- [ ] El Sheet tiene las 5 hojas con las cabeceras del `sheet-schemas/`.
- [ ] El primer artículo de prueba completa el ciclo Writer end-to-end y aparece live tras el build Vercel.
