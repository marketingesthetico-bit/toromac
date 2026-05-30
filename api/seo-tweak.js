// Endpoint para que el agente On-site SEO Modifier aplique pequeñas
// modificaciones aprobadas por el Reviewer.
//
// Contrato: POST con header `Authorization: Bearer <PUBLISH_SECRET>` y body
//   {
//     "path": "src/data/articles/es/guia-tipos-cangilones-elevadores.json",
//     "content": "<contenido nuevo completo del archivo>",
//     "message": "SEO tweak: mejorar metaDescription para CTR",
//     "mode": "automerge" | "pr",
//     "agent": "onsite",            // quién propone (para changelog)
//     "reason": "GSC reporta CTR bajo en esta URL"
//   }
//
// En modo automerge → PUT directo al archivo en main.
// En modo pr → crea rama desde main, escribe el archivo, abre PR contra main.

export const config = { runtime: 'nodejs' };

const GITHUB_API = 'https://api.github.com';

const ALLOWED_PREFIXES = [
  'src/data/articles/',
  'src/data/products/',
  'src/locales/',
  'src/pages/',
  'src/components/',
  'public/images/',
  'public/robots.txt',
  'index.html',
];

function pathAllowed(p) {
  if (!p || typeof p !== 'string') return false;
  if (p.includes('..') || p.startsWith('/')) return false;
  return ALLOWED_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix));
}

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'toromac-seo-tweak',
  };
}

async function getFileSha({ repo, token, path, ref }) {
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}${
    ref ? `?ref=${encodeURIComponent(ref)}` : ''
  }`;
  const res = await fetch(url, { headers: ghHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET contents ${path} failed: ${res.status}`);
  const json = await res.json();
  return json.sha;
}

async function putFile({ repo, token, path, content, message, branch, sha }) {
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
  };
  if (sha) body.sha = sha;
  if (branch) body.branch = branch;
  const res = await fetch(url, {
    method: 'PUT',
    headers: ghHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`PUT ${path} failed: ${res.status} ${detail}`);
  }
  return res.json();
}

async function getMainSha({ repo, token }) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/git/refs/heads/main`, {
    headers: ghHeaders(token),
  });
  if (!res.ok) throw new Error(`GET refs/heads/main failed: ${res.status}`);
  const json = await res.json();
  return json.object.sha;
}

async function createBranch({ repo, token, branch, fromSha }) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/git/refs`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: fromSha }),
  });
  if (!res.ok && res.status !== 422) {
    // 422 = ya existe; lo aceptamos
    const detail = await res.text();
    throw new Error(`Create branch ${branch} failed: ${res.status} ${detail}`);
  }
}

async function openPR({ repo, token, branch, title, body }) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/pulls`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ title, head: branch, base: 'main', body }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Open PR failed: ${res.status} ${detail}`);
  }
  return res.json();
}

function slugBranch(reason = 'seo-tweak') {
  const safe = String(reason).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/^-|-$/g, '');
  const stamp = Math.floor(Date.now() / 1000).toString(36);
  return `agent/${safe || 'seo-tweak'}-${stamp}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });
  }

  const auth = req.headers.authorization || '';
  if (!process.env.PUBLISH_SECRET || auth !== `Bearer ${process.env.PUBLISH_SECRET}`) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    return res.status(500).json({ ok: false, error: 'config' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { path, content, message, mode = 'pr', agent = 'unknown', reason = '' } = body || {};

  if (!pathAllowed(path)) {
    return res.status(400).json({ ok: false, error: 'path-not-allowed' });
  }
  if (typeof content !== 'string' || content.length === 0) {
    return res.status(400).json({ ok: false, error: 'invalid-content' });
  }
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'invalid-message' });
  }
  if (!['automerge', 'pr'].includes(mode)) {
    return res.status(400).json({ ok: false, error: 'invalid-mode' });
  }

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const fullMessage = `${message}\n\nAgent: ${agent}\nReason: ${reason}`;

  try {
    if (mode === 'automerge') {
      const sha = await getFileSha({ repo, token, path, ref: 'main' });
      const result = await putFile({
        repo, token, path, content, message: fullMessage, sha,
      });
      return res.status(200).json({
        ok: true,
        mode,
        commit: result.commit?.sha,
        url: result.content?.html_url,
      });
    }

    // mode === 'pr'
    const mainSha = await getMainSha({ repo, token });
    const branch = slugBranch(reason);
    await createBranch({ repo, token, branch, fromSha: mainSha });
    const sha = await getFileSha({ repo, token, path, ref: branch });
    await putFile({ repo, token, path, content, message: fullMessage, branch, sha });
    const pr = await openPR({
      repo, token, branch,
      title: message.slice(0, 70),
      body: `**Agent:** ${agent}\n**Reason:** ${reason}\n\nPropuesta automática del equipo SEO. Revisar y mergear si procede.`,
    });
    return res.status(200).json({
      ok: true,
      mode,
      branch,
      pr_url: pr.html_url,
      pr_number: pr.number,
    });
  } catch (err) {
    console.error('[api/seo-tweak] error:', err.message);
    return res.status(502).json({ ok: false, error: 'github', detail: err.message });
  }
}
