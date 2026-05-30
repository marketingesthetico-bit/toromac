// Endpoint que recibe el informe mensual del Monthly Reporter y lo envía
// por email a marketingesthetico@gmail.com vía Resend.
//
// Contrato: POST con header `Authorization: Bearer <PUBLISH_SECRET>` y body:
//   {
//     "month": "2026-05",
//     "summary": {
//       "clicks_total": 12450, "impresiones_gsc": 245000, "clicks_gsc": 6700,
//       "ctr_medio": 2.73, "posicion_media": 18.4,
//       "articulos_publicados": 8, "cambios_onsite": 23, "issues_gsc_resueltas": 5
//     },
//     "top_pages": [{ "url": "...", "clicks": 1234, "position": 4.2 }, ...],
//     "queries_gain": [{ "query": "...", "delta_position": -3.2 }, ...],
//     "queries_loss": [{ "query": "...", "delta_position": 2.1 }, ...],
//     "opportunities": [{ "keyword": "...", "impressions": 500, "position": 12.3 }, ...],
//     "alerts": [{ "type": "...", "detail": "..." }, ...]
//   }

import { Resend } from 'resend';

export const config = { runtime: 'nodejs' };

const REPORT_TO = 'marketingesthetico@gmail.com';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function num(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('es-ES').format(n);
}

function pct(n, decimals = 2) {
  if (n == null) return '—';
  return Number(n).toFixed(decimals) + ' %';
}

function table(rows, headers) {
  if (!rows?.length) return '<p style="color:#6B7280;font-style:italic">Sin datos este mes.</p>';
  return `
    <table style="width:100%;border-collapse:collapse;margin:8px 0 20px;font-size:14px">
      <thead>
        <tr>${headers.map((h) => `<th style="text-align:left;padding:10px 12px;background:#F4F4F6;border-bottom:1px solid #E5E7EB;font-weight:600">${esc(h)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map((r) => `<tr>${r.map((c) => `<td style="padding:10px 12px;border-bottom:1px solid #F4F4F6;vertical-align:top">${esc(c)}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `;
}

function metricCard(label, value) {
  return `
    <div style="flex:1;min-width:140px;padding:14px 16px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6B7280;margin-bottom:6px">${esc(label)}</div>
      <div style="font-size:22px;font-weight:700;color:#0A0A0A;font-family:Inter,Arial,sans-serif">${esc(value)}</div>
    </div>
  `;
}

function renderReport({ month, summary = {}, top_pages = [], queries_gain = [], queries_loss = [], opportunities = [], alerts = [] }) {
  const subject = `[Toromac SEO] Informe ${month}`;
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>${esc(subject)}</title></head>
<body style="margin:0;padding:24px;background:#F4F4F6;font-family:Inter,Arial,sans-serif;color:#0A0A0A;line-height:1.55">
  <div style="max-width:720px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden">

    <div style="padding:28px 32px;background:#0A0A0A;color:#FFFFFF">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#3D63D6;margin-bottom:8px">Toromac · SEO Monthly Report</div>
      <h1 style="margin:0;font-size:28px;font-weight:800">Informe SEO ${esc(month)}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px">Generado automáticamente por el equipo de agentes.</p>
    </div>

    <div style="padding:28px 32px">

      <h2 style="margin:0 0 16px;font-size:18px;font-weight:700">Resumen del mes</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px">
        ${metricCard('Clicks GSC', num(summary.clicks_gsc))}
        ${metricCard('Impresiones', num(summary.impresiones_gsc))}
        ${metricCard('CTR medio', pct(summary.ctr_medio))}
        ${metricCard('Posición media', summary.posicion_media != null ? Number(summary.posicion_media).toFixed(1) : '—')}
        ${metricCard('Sesiones GA4', num(summary.clicks_total))}
        ${metricCard('Artículos', num(summary.articulos_publicados))}
        ${metricCard('Cambios on-site', num(summary.cambios_onsite))}
        ${metricCard('Issues resueltas', num(summary.issues_gsc_resueltas))}
      </div>

      <h2 style="margin:0 0 8px;font-size:18px;font-weight:700">Top 5 páginas</h2>
      ${table(top_pages.slice(0, 5).map((p) => [p.url, num(p.clicks), p.position != null ? Number(p.position).toFixed(1) : '—']), ['URL', 'Clicks', 'Pos. media'])}

      <h2 style="margin:0 0 8px;font-size:18px;font-weight:700">Queries que ganan posición</h2>
      ${table(queries_gain.slice(0, 5).map((q) => [q.query, (q.delta_position > 0 ? '+' : '') + Number(q.delta_position).toFixed(1)]), ['Query', 'Δ posición'])}

      <h2 style="margin:0 0 8px;font-size:18px;font-weight:700">Queries que pierden posición</h2>
      ${table(queries_loss.slice(0, 5).map((q) => [q.query, (q.delta_position > 0 ? '+' : '') + Number(q.delta_position).toFixed(1)]), ['Query', 'Δ posición'])}

      <h2 style="margin:0 0 8px;font-size:18px;font-weight:700">Oportunidades (input para el Writer)</h2>
      <p style="margin:0 0 8px;color:#6B7280;font-size:14px">Keywords con impresiones pero posición mejorable. El Writer las añadirá al backlog este mes.</p>
      ${table(opportunities.slice(0, 10).map((o) => [o.keyword, num(o.impressions), Number(o.position).toFixed(1)]), ['Keyword', 'Impresiones', 'Posición'])}

      ${alerts.length ? `
        <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#C8102E">Alertas abiertas</h2>
        ${table(alerts.map((a) => [a.type, a.detail]), ['Tipo', 'Detalle'])}
      ` : ''}

      <div style="margin-top:24px;padding:16px;background:#F4F4F6;border-left:3px solid #2B4FBF;border-radius:6px;font-size:13px;color:#0A0A0A/85">
        <strong>Siguiente ciclo:</strong> el Writer recogerá las oportunidades listadas como nuevas keywords del backlog. El Competitor Analyzer ampliará el análisis sobre las queries que pierden posición.
      </div>

    </div>

    <div style="padding:18px 32px;background:#F4F4F6;border-top:1px solid #E5E7EB;font-size:11px;color:#6B7280;text-align:center">
      Toromac SEO Agents · Generado por el Monthly Reporter · toromac.com
    </div>
  </div>
</body>
</html>`;
  return { subject, html };
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
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok: false, error: 'config' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  if (!body?.month) {
    return res.status(400).json({ ok: false, error: 'missing-month' });
  }

  const { subject, html } = renderReport(body);
  const sender = process.env.SENDER_EMAIL || 'Toromac <noreply@toromac.com>';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: sender,
      to: [REPORT_TO],
      subject,
      html,
    });
    if (result.error) {
      console.error('[api/agent-report] resend error:', result.error);
      return res.status(502).json({ ok: false, error: 'send' });
    }
    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error('[api/agent-report] unexpected:', err.message);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
}
