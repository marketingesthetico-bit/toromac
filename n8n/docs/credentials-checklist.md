# Credenciales y variables — checklist

Las claves se reparten entre dos entornos:
- **Vercel** (env vars del proyecto del sitio, leídas por `api/*.js`) → nombres simples sin prefijo (`PUBLISH_SECRET`, `GITHUB_TOKEN`, `RESEND_API_KEY`, etc.).
- **n8n / Render** (env vars del servicio que corre n8n, leídas por los workflows con `{{$env.NOMBRE}}`) → **todas con prefijo `TOROMAC_`** para evitar colisiones con otros workflows del mismo n8n.
- **n8n Credentials** (UI de Credentials de n8n, para flujos OAuth, Service Account, etc.) → nombre exacto `Toromac <Servicio>`.

## Vercel — env vars del sitio (sin prefijo)

| Clave | Dónde obtenerla | Dónde se usa |
|---|---|---|
| `GITHUB_TOKEN` | github.com → Settings → Developer Settings → PAT classic, scope `repo` | `api/publish-article`, `api/seo-tweak` |
| `GITHUB_REPO` | `marketingesthetico-bit/toromac` (ya configurado) | `api/publish-article`, `api/seo-tweak` |
| `PUBLISH_SECRET` | Genera con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Bearer de los 3 endpoints |
| `RESEND_API_KEY` | ✅ Ya configurado | `api/contact`, `api/quote`, `api/agent-report` |
| `SENDER_EMAIL` | ✅ Ya configurado | Mismos |
| `CONTACT_EMAIL` | ✅ Ya configurado | `api/contact`, `api/quote` |
| `VITE_GA_ID` | GA4 → Admin → Data Streams → Web (`G-XXXXXXXX`) | Cliente, `src/utils/analytics.js` |
| `VITE_GSC_VERIFICATION` | GSC verificación por meta tag (o vacío si verificas por DNS) | `index.html` |

## Render — env vars del servicio n8n (con prefijo `TOROMAC_`)

n8n las lee con `{{$env.TOROMAC_NOMBRE}}` en los nodos.

| Clave | Valor / fuente |
|---|---|
| `TOROMAC_PUBLISH_SECRET` | Mismo valor que en Vercel `PUBLISH_SECRET` (duplicado: una copia por entorno) |
| `TOROMAC_GITHUB_TOKEN` | Mismo valor que en Vercel `GITHUB_TOKEN` (duplicado) |
| `TOROMAC_SERPER_API_KEY` | [serper.dev](https://serper.dev) → Dashboard → API Key |
| `TOROMAC_SHEET_ID` | ID de la Google Sheet (de la URL: `docs.google.com/spreadsheets/d/<ID>/edit`) |
| `TOROMAC_GSC_SITE_URL` | `sc-domain:toromac.com` si verificaste por DNS, o `https://toromac.com/` si por URL |
| `TOROMAC_GA4_PROPERTY_ID` | GA4 → Admin → Property Settings (numérico, ej. `123456789`) |
| `TOROMAC_SITE_URL` | `https://toromac.com` |
| `TOROMAC_API_BASE` | `https://toromac.com/api` |
| `TOROMAC_COMPETITORS` | `sinfimasa.com,marobera.com,maquinariatadel.com,ulmapackaging.com,rovema.com,grupoegasa.com` |
| `TOROMAC_TARGET_KEYWORDS_ES` | Lista separada por comas (ver más abajo) |
| `TOROMAC_TARGET_KEYWORDS_EN` | Lista separada por comas (ver más abajo) |
| `TOROMAC_URLS_PRIORITARIAS` | URLs separadas por comas: home, /productos, /productos/elevador-cangilones-tipo-z, /novedades… |
| `TOROMAC_TELEGRAM_CHAT_ID` | Chat ID del grupo de Telegram (con guión inicial si es grupo) |

## n8n — Credentials (UI nativa)

Nombres EXACTOS (los workflows los referencian así). Los valores se introducen en n8n y nunca se exportan a Render.

| Credential | Tipo n8n | Cómo |
|---|---|---|
| `Toromac Anthropic` | Anthropic API | API key de console.anthropic.com |
| `Toromac OpenAI` | OpenAI API | API key de platform.openai.com |
| `Toromac Google` | Google Service Account | JSON del service account (sube `client_email` y `private_key`) |
| `Toromac GSC OAuth` | Google OAuth2 API | Client ID + Client Secret del OAuth client de Google Cloud + login interactivo con `toromac.seo.agents@gmail.com` |
| `Toromac Telegram` | Telegram | Bot Token de @BotFather |

## Listado inicial de keywords objetivo

### `TOROMAC_TARGET_KEYWORDS_ES` (26)

```
elevador de cangilones,elevador de cangilones tipo z,elevador de cangilones tipo c,elevador de cangilones tipo o,elevador de cangilones móvil,elevador de banda tipo z,tornillo sin fin elevador,cinta transportadora industrial,cinta transportadora de banda,cangilones para elevadores,cangilón calyon,cangilón metal detectable,recambio cangilones poliamida,tamizadora industrial,tamiz centrífugo industrial,tamizadora centrífuga acero inoxidable,freidora industrial acero inoxidable,caldera volcable industrial,soporte big bag industrial,alimentador de silos industrial,depósito agua purificada acero inox,canal de alimentación vibrada,filtro ciclónico industrial,transporte industrial granulados,manipulación higiénica polvos,equipos atex industria química
```

### `TOROMAC_TARGET_KEYWORDS_EN` (26)

```
bucket elevator,z-type bucket elevator,c-type bucket elevator,o-type bucket elevator,mobile bucket elevator,z-type belt elevator,screw conveyor elevator,industrial conveyor belt,industrial belt conveyor,elevator buckets,calyon bucket,metal detectable bucket,polyamide bucket spare parts,industrial sifter,centrifugal sifter industrial,stainless steel centrifugal sifter,stainless steel industrial fryer,industrial tilting kettle,industrial big bag support,industrial silo feeder,purified water tank stainless steel,vibratory feeder,industrial cyclone filter,industrial granulate transport,hygienic powder handling,atex chemical industry equipment
```

### `TOROMAC_URLS_PRIORITARIAS`

```
https://toromac.com/,https://toromac.com/productos,https://toromac.com/productos/elevador-cangilones-tipo-z,https://toromac.com/productos/cinta-transportadora-banda-industrial,https://toromac.com/novedades,https://toromac.com/en,https://toromac.com/en/products,https://toromac.com/en/products/z-type-bucket-elevator,https://toromac.com/en/news
```

## Checklist de verificación final

Antes de activar workflows en producción:
- [ ] Endpoint `/api/publish-article` responde 401 sin Bearer y 200 con Bearer correcto en un payload de prueba.
- [ ] Endpoint `/api/seo-tweak` igual.
- [ ] Endpoint `/api/agent-report` envía un email de prueba a `marketingesthetico@gmail.com`.
- [ ] Bot de Telegram responde con un mensaje de "Toromac SEO online" enviado manualmente.
- [ ] Service account tiene acceso a GA4 + Sheet (verificar leyendo una métrica de prueba).
- [ ] GSC OAuth permite leer GSC (`toromac.seo.agents@gmail.com` Owner en la propiedad).
- [ ] Serper.dev key tiene créditos disponibles y devuelve resultados para una keyword test (`curl -X POST https://google.serper.dev/search -H "X-API-KEY: <key>" -H "Content-Type: application/json" -d '{"q":"elevador cangilones tipo z","gl":"es","hl":"es","num":3}'`).
- [ ] El Sheet tiene las 5 hojas con las cabeceras del `sheet-schemas/`.
- [ ] El primer artículo de prueba completa el ciclo Writer end-to-end y aparece live tras el build Vercel.
