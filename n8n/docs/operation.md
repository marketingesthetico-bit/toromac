# Operación diaria

## Cómo saber que todo va bien

1. **Telegram** — recibirás un mensaje cuando un workflow falle o detecte algo crítico (caída de posición, error de GSC, build fallido).
2. **Email mensual** — el día 1 de cada mes llega el informe completo a `marketingesthetico@gmail.com`.
3. **Google Sheet** — `seo-changelog` muestra toda la actividad en orden cronológico. Si llevas más de 24h sin filas nuevas, algo está parado.

## Cómo pausar un agente

En n8n, abrir el workflow → toggle "Active" off. El cron deja de disparar. Los webhooks (Reviewer) siguen respondiendo a llamadas activas pero no a las nuevas.

## Cómo intervenir manualmente

### Forzar publicación de un artículo concreto
1. En `keywords-backlog`, mover esa fila al principio y poner `prioridad = alta`.
2. En n8n, ejecutar el workflow 01 Writer manualmente.

### Forzar análisis de un competidor concreto
1. En el workflow 02 Competitor Analyzer, usar el modo manual con un override de keyword.
2. Verificar nuevas filas en `competitor-findings`.

### Hacer un cambio on-site puntual saltándose el Reviewer
No hacerlo. Si el Reviewer bloquea un cambio repetidamente, revisar:
- ¿El Modifier propone algo correcto?
- ¿El Reviewer es demasiado estricto?
Ajustar los prompts en lugar de saltarse el control.

### Pausar todo el sistema
Desactivar los 6 workflows. Las visitas a la web siguen funcionando: los agentes solo escriben/modifican, no sirven tráfico.

## Cómo depurar un fallo

1. En n8n → Executions → filtrar por el workflow afectado → última ejecución con error.
2. Click en el nodo rojo → ver el payload de entrada y el error.
3. Causas más comunes:
   - **Credential caducada** (especialmente PAT GitHub o API key Anthropic con límite).
   - **Rate limit** en SerpAPI / Anthropic / OpenAI.
   - **Sheet ID o pestaña mal nombrada**.
   - **Endpoint `/api/*` devuelve 401** → revisar PUBLISH_SECRET en n8n vs Vercel.
   - **GitHub 422 al crear branch/PR** → ya existe rama con ese nombre; el slugBranch añade timestamp así que rarísimo.

## Lectura periódica de salud

Sin esperar al informe mensual, cada semana mira:
- ¿Cuántas filas nuevas en `seo-changelog`? (proxy de actividad)
- ¿Cuántas tareas pendientes en `competitor-findings` y `gsc-issues`? (carga del On-site)
- ¿Cuántos artículos publicados? (esperado: 2/sem por idioma)
- ¿Alguna PR abierta del agente esperando review humana?

Si algo va muy fuera de pauta, abrir n8n y mirar Executions.

## Costes

Estimación mensual orientativa (varía por uso real):

| Servicio | Coste aproximado |
|---|---|
| Anthropic (Claude Sonnet) | 30–80 USD según volumen de artículos y análisis |
| OpenAI (GPT-4o-mini) | 5–15 USD |
| SerpAPI | 50 USD (plan básico, 5.000 búsquedas) o equivalente |
| Resend | Gratis hasta 100/día, normalmente sobra |
| Google APIs | Gratis dentro de cuotas estándar |
| Telegram | Gratis |
| n8n en Render | Lo que ya pagas |

El cuello más probable es SerpAPI. Si crece el volumen, evaluar DataForSEO o cache de SERPs.

## Cambios futuros

Para añadir un agente nuevo:
1. Crear carpeta `workflows/0X-nombre/` con `README.md` y prompts.
2. Si necesita endpoint nuevo en el sitio, crearlo en `api/` con Bearer y añadirlo a la lista del README principal de n8n.
3. Si necesita nueva pestaña en el Sheet, añadirla y documentar el schema.
4. Actualizar este `operation.md` con los nuevos puntos de control.
