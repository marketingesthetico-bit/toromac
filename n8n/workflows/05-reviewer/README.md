# Workflow 05 — Reviewer adversarial

**Misión:** validar cada propuesta del On-site Modifier antes del auto-merge. Adversarial: el rol del Reviewer es **buscar razones para rechazar**, no para aprobar. Solo si pasa todas las comprobaciones autoriza el merge directo a `main`. En cualquier otro caso → PR para revisión humana.

**Trigger:** webhook síncrono desde el Workflow 04 On-site Modifier.
**Credentials:** `Toromac Anthropic`, `Toromac GitHub` (lectura del repo para comparar contra main).

---

## Estructura

```
[1] Webhook Trigger (POST con { path, current_content, new_content, message, reason, agent })
  ↓
[2] Validaciones técnicas deterministas (Code JS):
    - path está en allowlist (mismo regex que api/seo-tweak)
    - new_content no está vacío
    - Si .json → JSON.parse válido
    - Si .json de articulo → estructura mínima respetada (slug.es, slug.en, content.es, faq existentes)
    - new_content no contiene emoji
    - Diff (caracteres añadidos/quitados) razonable: no se borra más del 20% del archivo original
  ↓
[3] IF alguna validación técnica falla → response { verdict: "fail", reason: "...", checks_failed: [...] }
  ↓
[4] Anthropic Sonnet: revisión semántica adversarial
  ↓
[5] Code: parsear respuesta del modelo
  ↓
[6] Combinar verdict técnico + semántico
  ↓
[7] Sheets append seo-changelog (reviewer, verdict, payload)
  ↓
[8] Response síncrona al On-site Modifier
```

---

## Nodo [2] — Validaciones deterministas

Antes de pagar al modelo, comprobaciones gratuitas y rápidas:

```js
const ALLOWED_PREFIXES = [
  'src/data/articles/', 'src/data/products/', 'src/locales/',
  'src/pages/', 'src/components/', 'public/images/', 'public/robots.txt', 'index.html',
];

function checkPath(path) {
  if (path.includes('..') || path.startsWith('/')) return 'path-traversal';
  if (!ALLOWED_PREFIXES.some(p => path === p || path.startsWith(p))) return 'path-not-allowed';
  return null;
}

function checkJsonValid(content, path) {
  if (!path.endsWith('.json')) return null;
  try { JSON.parse(content); return null; } catch (e) { return 'invalid-json:' + e.message; }
}

function checkEmoji(content) {
  // Bloque general de emoji/dingbats/símbolos pictográficos:
  const emojiRe = /\p{Extended_Pictographic}/u;
  return emojiRe.test(content) ? 'contains-emoji' : null;
}

function checkSizeDelta(current, next) {
  const removed = Math.max(0, current.length - next.length);
  if (current.length === 0) return null;
  return removed / current.length > 0.20 ? 'too-much-removed' : null;
}

function checkArticleShape(content, path) {
  if (!/src\/data\/articles\//.test(path)) return null;
  try {
    const a = JSON.parse(content);
    if (!a.id || !a.slug?.es || !a.slug?.en || !a.content?.es || !a.content?.en) return 'article-shape-broken';
    return null;
  } catch { return 'article-shape-unparseable'; }
}
```

Si cualquiera devuelve un string → `verdict: "fail"` sin llamar al modelo.

---

## Nodo [4] — Revisión semántica con Claude Sonnet

**System prompt:**
```
Eres revisor adversarial de cambios on-site SEO de Toromac. Tu trabajo es BUSCAR RAZONES PARA RECHAZAR el cambio propuesto, no para aprobarlo. Solo das aprobación si el cambio:
1. Mejora claramente el SEO o la calidad de la página, justificado por la razón aportada.
2. Mantiene el tono editorial clínico-técnico de Toromac (CLAUDE.md §9: sin emoji, sin exclamaciones, sin marketing fluff, sin segundas personas afectivas, sin "descubre/discover/imagine").
3. Preserva la integridad i18n: si se cambia el campo ES de algo, el EN debería seguir coherente (no se rompe la paridad).
4. No introduce datos falsos o sin base (cifras específicas, normas, fechas).
5. Respeta el formato del archivo (estructura de bloques, schema esperado).
Si tienes cualquier duda razonable, RECHAZA. El coste de un PR para humano es bajo; el de un auto-merge incorrecto es alto.
```

**User prompt (template):**
```
CONTEXTO DEL CAMBIO:
- Path: {{path}}
- Razón aportada por el agente: {{reason}}
- Mensaje de commit propuesto: {{message}}

CONTENIDO ACTUAL (extracto si >10KB):
{{current_content}}

CONTENIDO NUEVO PROPUESTO (extracto si >10KB):
{{new_content}}

Devuelve EXCLUSIVAMENTE este JSON:

{
  "verdict": "pass" | "fail",
  "checks": {
    "seo_justified": true|false,
    "tone_clinical": true|false,
    "i18n_integrity": true|false,
    "no_hallucinations": true|false,
    "format_preserved": true|false
  },
  "comments": "razón concreta en 1-2 frases. Si pass, qué mejora. Si fail, qué falla y qué corregir.",
  "suggested_message": "mensaje de commit refinado opcional"
}

Reglas estrictas:
- Si introduce emoji → fail (aunque esté en un campo de texto).
- Si la "razón" no justifica el cambio (ej. razón habla de meta description pero el diff cambia el contenido del cuerpo) → fail.
- Si el campo cambiado en ES no tiene equivalente en EN actualizado y debería tenerlo → fail.
- Si introduce cifras o normas concretas que no estaban antes y no hay manera de verificarlas → fail.
- Si añade texto comercial/sensorial → fail.
- Si todo está claro y mejora medible → pass.
```

---

## Nodo [6] — Combinación de verdicts

```js
const technicalChecks = $('Validaciones deterministas').first().json;
const modelVerdict = $('Anthropic Sonnet').first().json;

if (technicalChecks.failedChecks.length > 0) {
  return {
    verdict: 'fail',
    reason: 'technical',
    checks_failed: technicalChecks.failedChecks,
    comments: 'Falló validación técnica: ' + technicalChecks.failedChecks.join(', '),
  };
}

return {
  verdict: modelVerdict.verdict,
  reason: 'semantic',
  checks: modelVerdict.checks,
  comments: modelVerdict.comments,
  suggested_message: modelVerdict.suggested_message,
};
```

---

## Nodo [7] — Trazabilidad

Toda revisión, pase o falle, escribe una fila en `seo-changelog`:

```
timestamp: now
agente: reviewer
accion: review:<verdict>
target: <path>
resultado: pass | fail
payload: { reason, checks, comments }
```

Esto permite auditar el comportamiento del Reviewer en el tiempo y ajustar el system prompt si vemos que está siendo demasiado permisivo o demasiado estricto.

---

## Cómo medir si el Reviewer está bien calibrado

- **Tasa de pass:** si el 100% de propuestas pasan → el Reviewer no está cuestionando lo suficiente. Si <30% pasan → el On-site genera basura o el Reviewer es paranoico.
- **PRs auto-rechazadas por humano:** si el humano cierra muchas PRs (rechazadas) sin mergear → el Reviewer dejó pasar a PR cosas que no debía. Endurecer el system prompt.
- **PRs aprobadas y mergeadas sin cambios:** si el humano aprueba siempre las PRs sin tocar → el Reviewer es demasiado estricto. Relajar.

Objetivo de equilibrio: ~70% automerge, ~30% PR, casi todas las PRs aprobadas por humano con o sin retoques.
