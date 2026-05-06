import { Resend } from 'resend';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { quoteSchema } from '../src/utils/validation.js';
import { renderQuoteEmail } from '../src/utils/email.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Cargamos products.json via fs (mas portable que import attributes para
// distintas versiones de Node en Vercel).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsData = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'src', 'data', 'products', 'products.json'), 'utf8')
);

// Lookup acelerado: id producto -> producto completo
const PRODUCT_LOOKUP = Object.fromEntries(productsData.map((p) => [p.id, p]));

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const parsed = quoteSchema.safeParse(body || {});
  if (!parsed.success) {
    console.warn('[api/quote] validation failed:', parsed.error.flatten());
    return res.status(400).json({ ok: false, error: 'validation' });
  }
  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return res.status(200).json({ ok: true });
  }

  if (!PRODUCT_LOOKUP[data.productId]) {
    return res.status(400).json({ ok: false, error: 'unknown-product' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    console.error('[api/quote] missing env vars: RESEND_API_KEY or CONTACT_EMAIL');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  const sender = process.env.SENDER_EMAIL || 'Toromac <noreply@toromac.com>';
  const { subject, html, text } = renderQuoteEmail(data, PRODUCT_LOOKUP);

  try {
    const result = await resend.emails.send({
      from: sender,
      to: process.env.CONTACT_EMAIL.split(',').map((s) => s.trim()),
      reply_to: data.email,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error('[api/quote] resend error:', result.error);
      return res.status(502).json({ ok: false, error: 'send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/quote] unexpected error:', err);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
}
