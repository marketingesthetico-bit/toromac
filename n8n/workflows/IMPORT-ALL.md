# Importar workflows 02, 03 y 06 — guía rápida

Los tres workflows son independientes y se pueden importar y probar en cualquier orden. Los 04 (On-site Modifier) y 05 (Reviewer) los dejamos para una segunda tanda.

## Para cada workflow.json

1. Personal → Workflows → arrastra el archivo `n8n/workflows/0X-*/workflow.json` sobre la lista de workflows.
2. Tras el import, abre el workflow nuevo.
3. Rebindea credenciales en los nodos marcados con warning amarillo.
4. Save.
5. Test manual con **Execute workflow**.
6. NO actives todavía (deja Inactive hasta validar).

## Credentials por workflow

### 02 Competitor Analyzer

| Nodo | Credential |
|---|---|
| Anthropic Analyze Gap | `Toromac Anthropic` (Predefined: anthropicApi) |
| Append Finding | `Toromac Google` |
| Append Changelog | `Toromac Google` |
| Telegram Notify | `Toromac Telegram` |

Cron: viernes 06:00 UTC. Analiza las **5 primeras keywords** de `TOROMAC_TARGET_KEYWORDS_ES` cada semana (en ~5 semanas cubre las 26). Si detecta que un competidor de la lista nos supera en SERP, mete una fila en `competitor-findings`.

### 03 GSC Monitor

| Nodo | Credential |
|---|---|
| GSC Current Week | `Toromac GSC OAuth` (Predefined: googleOAuth2Api) |
| Append Issue Row | `Toromac Google` |
| Append Changelog | `Toromac Google` |
| Telegram Summary | `Toromac Telegram` |

Cron: lunes 07:00 UTC. Lee últimos 7 días de Search Console y detecta:
- **LOW_CTR**: queries con >50 imp y CTR <1%
- **OPPORTUNITY**: queries con >100 imp y posición >20 (candidatas a artículo nuevo)

Escribe filas en `gsc-issues` y notifica resumen por Telegram.

### 06 Monthly Reporter

| Nodo | Credential |
|---|---|
| GSC Month Data | `Toromac GSC OAuth` |
| GSC Top Pages | `Toromac GSC OAuth` |
| Append Monthly Report | `Toromac Google` |
| Append to Backlog | `Toromac Google` |
| Telegram Summary | `Toromac Telegram` |

Cron: día 1 de cada mes 08:00 UTC. Agrega métricas del mes anterior desde GSC, envía email HTML a `marketingesthetico@gmail.com` vía `/api/agent-report`, mete las oportunidades (queries con impresiones pero posición lejana) como filas nuevas en `keywords-backlog` con `origen=reporter` para que el Writer las coja.

## Notas comunes

- Todos los workflows usan **HTTP Request para Anthropic** con `Predefined Credential Type → Anthropic API → Toromac Anthropic`. Si al rebindear no ves "Anthropic API" en el desplegable, comprueba que `Toromac Anthropic` está creada como tipo "Anthropic API" en Credentials.
- Para los nodos GSC, la credential es `Toromac GSC OAuth` (tipo Google OAuth2 API). Predefined credential type: `googleOAuth2Api`.
- `chatId` de Telegram va **hardcodeado** a `-5142553799` en todos los nodos (evita el problema del editor preview con `$env`).
- Todos los nodos Append (no Update) no tienen el bug v4.5 del Sheets node, así que funcionan limpio.

## Si algo falla

- **Anthropic devuelve error de cuota** → revisa créditos en console.anthropic.com.
- **GSC devuelve 403** → la cuenta `toromac.seo.agents@gmail.com` no es Owner en la propiedad GSC. Verifica permisos.
- **Sheets devuelve 403** → el service account no tiene acceso a la Sheet. Verifica que está compartida como Editor.
- **Agent-report devuelve 500 config** → falta `RESEND_API_KEY` en Vercel (debería estar ya).

## Tests E2E sugeridos

Antes de activar crons:

### 02 Competitor
1. **Execute workflow** manual.
2. Comprueba `competitor-findings` en la Sheet — debería tener 0-5 filas nuevas (depende de cuántas keywords muestren gap).
3. Telegram: 0-5 mensajes (uno por gap detectado).

### 03 GSC Monitor
1. **Execute workflow** manual.
2. Si tu GSC tiene <28 días de histórico, el scan puede no devolver issues — normal.
3. Mira `gsc-issues` en la Sheet.

### 06 Reporter (cuidado, este envía email)
1. Antes de ejecutar manual, considera cambiar temporalmente el chat de Telegram o el destino del email para test (o tira sin cambios — si solo lo ejecutas tú, no es ruido).
2. **Execute workflow** manual.
3. Verifica:
   - Email en `marketingesthetico@gmail.com` con el resumen del mes.
   - Fila nueva en `monthly-reports`.
   - Filas nuevas en `keywords-backlog` con `origen=reporter`.

## Activar crons

Cuando los 3 pasen E2E, **activa cada workflow** (toggle Active en el header del workflow). A partir de ese momento:
- Viernes 06:00 UTC → Competitor scan
- Lunes 07:00 UTC → GSC weekly scan
- Día 1 de cada mes 08:00 UTC → Reporter

## Próximo paso

Una vez los 3 estén corriendo, queda generar 04 On-site Modifier + 05 Reviewer. Esos dos son interdependientes (Reviewer valida cambios de On-site) y necesitan más debugging. Los hacemos en la siguiente tanda cuando el resto del sistema esté estable.
