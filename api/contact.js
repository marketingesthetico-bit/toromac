import { Resend } from 'resend';
import { contactSchema } from '../src/utils/validation.js';
import { renderContactEmail } from '../src/utils/email.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Validacion server-side (los Zod errors NO se envian al cliente para evitar
  // filtrar la estructura del schema; solo se devuelve un codigo generico).
  const parsed = contactSchema.safeParse(body || {});
  if (!parsed.success) {
    console.warn('[api/contact] validation failed:', parsed.error.flatten());
    return res.status(400).json({ ok: false, error: 'validation' });
  }
  const data = parsed.data;

  // Honeypot anti-bot
  if (data.website && data.website.length > 0) {
    // Falsa OK para no dar pista al spammer
    return res.status(200).json({ ok: true });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    console.error('[api/contact] missing env vars: RESEND_API_KEY or CONTACT_EMAIL');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  const sender = process.env.SENDER_EMAIL || 'Toromac <noreply@toromac.com>';
  const { subject, html, text } = renderContactEmail(data);

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
      console.error('[api/contact] resend error:', result.error);
      return res.status(502).json({ ok: false, error: 'send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/contact] unexpected error:', err);
    return res.status(500).json({ ok: false, error: 'unexpected' });
  }
}
