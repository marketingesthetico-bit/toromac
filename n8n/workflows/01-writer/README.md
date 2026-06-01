# Workflow 01 — Writer agent

**Misión:** generar 2 artículos bilingües por semana (ES + EN, ≥2.000 palabras cada uno, con tabla técnica, ≥5 FAQs y CTA a producto) sobre keywords del backlog, y publicarlos automáticamente vía `/api/publish-article`.

**Cron:** Lunes y Jueves 09:00 (UTC+1).
**Credentials usadas:** `Toromac Google` (Sheets), `Toromac Serper`, `Toromac OpenAI`, `Toromac Anthropic`, `Toromac Vercel API`, `Toromac Telegram`.

---

## Estructura de nodos

```
[1] Cron Trigger
  ↓
[2] Sheets: Read keywords-backlog (donde estado=pendiente, prioridad DESC, LIMIT 1)
  ↓
[3] IF (¿hay fila?) — si no, fin
  ↓
[4] Sheets: Update estado=en_proceso (lock)
  ↓
[5] HTTP: Serper.dev search → POST https://google.serper.dev/search
     Header: X-API-KEY: {{$env.TOROMAC_SERPER_API_KEY}}
     Body JSON: {"q":"{{keyword_es}}","gl":"es","hl":"es","num":10}
  ↓
[6] Code (JS): de la respuesta, leer `organic[]` (NO `organic_results`) → extraer top 8 URLs
  ↓
[7] HTTP loop: fetch contenido de cada URL (parallel, timeout 15s)
  ↓
[8] Code (JS): extraer H1/H2s, longitud y FAQs visibles de cada competidor → resumen
  ↓
[9] OpenAI (GPT-4o-mini): generar BRIEF JSON
  ↓
[10] Anthropic (Claude Sonnet): redactar ARTÍCULO ES (devuelve JSON estructurado)
  ↓
[11] Anthropic (Claude Sonnet): adaptar ARTÍCULO EN
  ↓
[12] OpenAI (GPT-4o-mini): SEO REVIEW de ambos (devuelve issues + fixes)
  ↓
[13] IF (¿issues críticos?) → bucle a [10/11] solo del campo con issue
  ↓
[14] HTTP POST → https://toromac.com/api/publish-article (Bearer)
  ↓
[15] Sheets: Update estado=publicado, url_es, url_en, fecha, palabras
  ↓
[16] Sheets: append seo-changelog (agente=writer, accion=publicar, target=slug)
  ↓
[17] Telegram: "✅ Publicado: <titulo> · <url_es> · <url_en>"
```

Errores → catch global → marca estado=`error_temporal`, Telegram con detalle, no consume la keyword.

---

## Nodo [9] — Brief con GPT-4o-mini

**System prompt:**
```
Eres analista SEO de Toromac, fabricante español de maquinaria industrial para alimentación, farma y química. Tu trabajo: convertir una keyword y el análisis de competidores en un brief técnico para que otro modelo redacte un artículo en español que supere a esos competidores.
```

**User prompt (template):**
```
KEYWORD: {{keyword_es}}
INTENCION: {{intencion}}
PRODUCTO_RELACIONADO_ID: {{producto_relacionado}}

COMPETIDORES (top {{n}} resultados orgánicos):
{{#each competitors}}
- {{url}}
  H1: {{h1}}
  H2s: {{h2s}}
  longitud aprox: {{words}} palabras
  FAQs detectadas: {{faqs_count}}
{{/each}}

Devuelve EXCLUSIVAMENTE un objeto JSON con esta estructura, sin texto extra ni markdown:

{
  "h1": "...",
  "metaDescription": "≤160 caracteres con la keyword exacta",
  "lead": "lead técnico de 2 frases",
  "outline": [
    { "h2": "...", "h3s": ["...", "..."], "puntos_clave": ["...", "..."] }
  ],
  "tabla_tecnica": { "headers": ["...", "..."], "rows": [["...", "..."]] },
  "faqs": [
    { "pregunta": "...", "respuesta_apunte": "..." }
  ],
  "cta_producto_id": "{{producto_relacionado}}",
  "angulo_diferenciador": "qué hacemos distinto respecto a los competidores listados, en 1-2 frases",
  "longitud_objetivo_palabras": 2200
}

Requisitos:
- 8-10 H2 que cubran lo que los competidores cubren más nuestro ángulo propio.
- Tabla técnica obligatoria con 3-7 filas relevantes (comparativa, especificaciones, etc.).
- 6 FAQs mínimo, técnicas, sin marketing.
- No mencionar competidores por nombre.
```

---

## Nodo [10] — Redacción ES con Claude Sonnet

**System prompt:**
```
Eres redactor técnico de Toromac, empresa española con +40 años fabricando maquinaria industrial para alimentación, farma, química y nutrición animal. Escribes en español técnico-clínico: directo, denso, sin retórica emocional ni sensorial, sin "descubre/desvela/imagina/sumérgete", sin emoji, sin exclamaciones. Tu salida debe poder publicarse sin edición humana.
```

**User prompt (template):**
```
BRIEF:
{{brief_json}}

KEYWORD PRINCIPAL: {{keyword_es}}

INSTRUCCIONES OBLIGATORIAS:
- Longitud mínima 2.000 palabras de cuerpo (sin contar FAQs).
- H1 con la keyword exacta.
- Densidad de keyword 1-2 % (natural, sin keyword stuffing).
- Meta description ≤160 caracteres, con la keyword.
- Estructura por bloques tipados como JSON (NO HTML, NO markdown en el texto).
- Cumplir tono clínico-técnico: hechos, números, criterios. Ningún adjetivo de marketing.
- Incluir la tabla técnica del brief.
- Incluir un callout práctico ("regla práctica" o similar) por cada 3-4 H2.
- Incluir al menos un ejemplo numérico orientativo si aplica (cálculo, especificación, etc.).
- Incluir las 6 FAQs del brief, ampliadas en respuesta de 60-120 palabras cada una.
- CTA al producto relacionado vía referencia interna (no escribas la URL: el componente la genera).
- No mencionar competidores por nombre.
- No usar emoji. No usar exclamaciones de marketing. No usar segundas personas afectivas ("descubre", "tú vas a", etc.) — solo usted, neutro.

DEVUELVE EXCLUSIVAMENTE este JSON, sin markdown, sin comentarios:

{
  "id": "<slug-es-sin-palabras-vacias>",
  "slug": { "es": "<slug-es>", "en": "<slug-en>" },
  "publishedAt": "<ISO datetime ahora>",
  "updatedAt": "<mismo>",
  "author": "Equipo Toromac",
  "category": "<id de categoría: elevacion-transporte | recambios-cangilones | procesado | dosificacion | otros>",
  "relatedProduct": "{{producto_relacionado}}",
  "title": { "es": "<H1>", "en": "<EN H1 — se rellenará en siguiente nodo>" },
  "metaDescription": { "es": "<meta>", "en": "<EN — se rellenará>" },
  "heroImage": "/images/products/<id-producto>.jpg",
  "heroImageAlt": { "es": "<alt>", "en": "<EN — se rellenará>" },
  "seo": {
    "es": { "title": "<title tag, max 60>", "description": "<meta, max 160>" },
    "en": { "title": "", "description": "" }
  },
  "content": {
    "es": [
      { "type": "p", "text": "..." },
      { "type": "h2", "text": "..." },
      { "type": "p", "text": "..." },
      { "type": "ul", "items": ["...", "..."] },
      { "type": "table", "headers": ["..."], "rows": [["..."]] },
      { "type": "callout", "text": "..." }
    ],
    "en": []
  },
  "faq": [
    {
      "question": { "es": "...", "en": "" },
      "answer": { "es": "...", "en": "" }
    }
  ],
  "tags": { "es": ["..."], "en": [] }
}

El slug ES se genera desde el H1 minimizado, máximo 5-6 palabras significativas. El slug EN se completa en el siguiente nodo.
```

---

## Nodo [11] — Adaptación EN con Claude Sonnet

**System prompt:**
```
You are a technical writer at Toromac, a Spanish manufacturer of industrial machinery for food, pharma, chemical and animal nutrition sectors. You write in clinical-technical English: direct, dense, no emotional or sensory rhetoric, no "discover/unveil/imagine/dive in", no emoji, no exclamations. Your output is published with no human edit.
```

**User prompt (template):**
```
SPANISH ARTICLE JSON (full bilingual structure, ES fields filled, EN fields empty):
{{article_es_json}}

KEYWORD EN: {{keyword_en}}
PRODUCT ID: {{producto_relacionado}}

INSTRUCTIONS:
- Adapt, do not translate literally. The English article should read native.
- Target body length 2.000+ words (English compresses ~10% vs Spanish; if needed, add one or two short paragraphs of genuine technical value, never filler).
- Use the EN keyword as the H1.
- Meta description ≤160 chars with the EN keyword.
- Same structure (blocks). Translate every block including tables, callouts, FAQs.
- Slug EN: same idea as ES slug, in English, max 5-6 significant words.
- Same clinical-technical tone in English. No marketing adjectives, no emoji.
- Fill ALL the `en` fields in the JSON: slug.en, title.en, metaDescription.en, heroImageAlt.en, seo.en, content.en, every FAQ's question.en + answer.en, tags.en.

Return ONLY the FULL bilingual JSON (with ES fields preserved untouched and EN fields completed). No markdown, no extra text.
```

---

## Nodo [12] — Revisión SEO con GPT-4o-mini

**System prompt:**
```
You are a senior SEO auditor reviewing an article JSON before publication. Check it against quality and SEO requirements and return a JSON verdict.
```

**User prompt:**
```
ARTICLE JSON:
{{article_json}}

KEYWORDS: ES={{keyword_es}} / EN={{keyword_en}}

Check:
1. H1 (title) contains the keyword exactly. (es and en)
2. Meta description length ≤160 chars. (es and en)
3. Content body has ≥2000 words. (es and en)
4. At least 5 FAQs, all with both languages filled.
5. At least one block of type "table" present.
6. Slug is URL-safe, no special chars, ≤50 chars.
7. No emoji anywhere in the text.
8. No marketing fluff in headings ("descubre", "discover", "imagina", "dive in", etc.).
9. relatedProduct ID exists (do NOT verify against a list, just that it's a slug-like string).
10. publishedAt is ISO 8601.

Return ONLY JSON:
{
  "pass": true|false,
  "issues": [
    { "field": "content.es.length", "current": 1850, "expected": "≥2000", "severity": "critical|warning" }
  ],
  "fixes_suggested": [
    { "field": "content.es", "instruction": "add a section on X with 200 more words" }
  ]
}
```

Si `pass=false` y hay issues `critical`, el workflow bucle al nodo de redacción correspondiente pasando los fixes como contexto adicional, y reintenta una vez. Si falla otra vez, marca estado=`requiere_revision_humana` y notifica Telegram.

---

## Nodo [14] — POST a /api/publish-article

```
URL: https://toromac.com/api/publish-article
Method: POST
Headers:
  Authorization: Bearer {{$env.TOROMAC_PUBLISH_SECRET}}
  Content-Type: application/json
Body:
  {
    "articleEs": {{article_json}},
    "articleEn": {{article_json}}
  }
```

Nota: el endpoint escribe en `src/data/articles/es/<slug-es>.json` y `src/data/articles/en/<slug-en>.json`. Como el artículo es un objeto bilingüe, ambos archivos son el mismo objeto (el hook deduplica por `id`).

---

## Manejo de errores

| Error | Acción |
|---|---|
| Serper.dev 429 | Reintentar 2 veces con backoff exponencial. Si falla, marcar `error_temporal`. |
| Anthropic timeout | Reintentar 1 vez. Si falla, marcar `error_temporal`. |
| Publish-article 401 | Crítico: PUBLISH_SECRET mal. Parar y Telegram urgente. |
| Publish-article 502 | GitHub rate limit. Reintentar en 5 min. |
| JSON inválido del modelo | Reintentar con prompt reforzado "responde solo JSON, sin texto". |
