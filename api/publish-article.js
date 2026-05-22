// Endpoint protegido que recibe artículos generados por n8n y los publica
// haciendo commit a GitHub vía la GitHub API. Vercel detecta el push y lanza
// build automático, dejando el artículo en producción.
//
// Contrato: POST con header `Authorization: Bearer <PUBLISH_SECRET>` y body
//   { "articleEs": { ...articulo bilingue... }, "articleEn": { ...articulo bilingue... } }
// Cada articulo se escribe en src/data/articles/es/<slug-es>.json y
// src/data/articles/en/<slug-en>.json. El hook useArticles deduplica por `id`.

export const config = { runtime: 'nodejs' };

const GITHUB_API = 'https://api.github.com';

function slugSafe(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function putFile({ repo, token, path, contentObj, message }) {
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'toromac-publish-article',
  };

  // Obtener sha si el archivo ya existe (para sobrescribir en vez de fallar).
  let sha;
  const existing = await fetch(url, { headers });
  if (existing.status === 200) {
    const json = await existing.json();
    sha = json.sha;
  }

  const content = Buffer.from(JSON.stringify(contentObj, null, 2) + '\n', 'utf8').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message, content, sha }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub PUT ${path} failed: ${res.status} ${detail}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });
  }

  // Autenticación Bearer.
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.PUBLISH_SECRET || ''}`;
  if (!process.env.PUBLISH_SECRET || auth !== expected) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    console.error('[api/publish-article] missing env: GITHUB_TOKEN or GITHUB_REPO');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { articleEs, articleEn } = body || {};
  if (!articleEs || !articleEn) {
    return res.status(400).json({ ok: false, error: 'missing-articles' });
  }

  const slugEs = slugSafe(articleEs.slug?.es || articleEs.id);
  const slugEn = slugSafe(articleEn.slug?.en || articleEn.id);
  if (!slugEs || !slugEn) {
    return res.status(400).json({ ok: false, error: 'invalid-slug' });
  }

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {
    await putFile({
      repo,
      token,
      path: `src/data/articles/es/${slugEs}.json`,
      contentObj: articleEs,
      message: `Publica artículo ES: ${slugEs}`,
    });
    await putFile({
      repo,
      token,
      path: `src/data/articles/en/${slugEn}.json`,
      contentObj: articleEn,
      message: `Publica artículo EN: ${slugEn}`,
    });

    return res.status(200).json({
      ok: true,
      urlEs: `https://toromac.com/novedades/${slugEs}`,
      urlEn: `https://toromac.com/en/news/${slugEn}`,
    });
  } catch (err) {
    console.error('[api/publish-article] error:', err.message);
    return res.status(502).json({ ok: false, error: 'github' });
  }
}
