// Templates HTML para emails enviados desde api/contact.js y api/quote.js.
// Estilo inline (algunos clientes ignoran <style>).
// Paleta Toromac: negro #0A0A0A, azul #2B4FBF, gris cold #F4F4F6.

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label, value) {
  if (value == null || value === '') return '';
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #E5E7EB;width:34%;color:#6B7280;font-size:13px;font-family:'Helvetica Neue',Arial,sans-serif;vertical-align:top;">${escape(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #E5E7EB;color:#0A0A0A;font-size:14px;font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.5;">${escape(value).replace(/\n/g, '<br>')}</td>
    </tr>`;
}

function sectionHeader(text) {
  return `
    <tr>
      <td colspan="2" style="padding:18px 16px 8px;background:#F4F4F6;color:#0A0A0A;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;border-top:2px solid #2B4FBF;">${escape(text)}</td>
    </tr>`;
}

function shell({ title, intro, rows, footerNote }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F6;font-family:'Helvetica Neue',Arial,sans-serif;color:#0A0A0A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F4F6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#ffffff;max-width:640px;width:100%;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:#0A0A0A;color:#ffffff;padding:20px 24px;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
            Toromac &middot; ${escape(title)}
          </td>
        </tr>
        <tr>
          <td style="padding:24px;color:#6B7280;font-size:14px;line-height:1.55;">
            ${escape(intro)}
          </td>
        </tr>
        <tr><td>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${rows}
          </table>
        </td></tr>
        <tr>
          <td style="padding:18px 24px;background:#0A0A0A;color:rgba(255,255,255,0.55);font-size:11px;line-height:1.55;">
            ${escape(footerNote || 'Mensaje generado automaticamente desde toromac.com')}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderContactEmail(data) {
  const isEn = data.lang === 'en';
  const title = isEn ? 'New contact form submission' : 'Nuevo contacto';
  const intro = isEn
    ? 'You received a new message from the contact form on toromac.com.'
    : 'Has recibido un nuevo mensaje desde el formulario de contacto de toromac.com.';
  const rows = [
    sectionHeader(isEn ? 'Contact' : 'Contacto'),
    row(isEn ? 'Name' : 'Nombre', data.name),
    row('Email', data.email),
    row(isEn ? 'Phone' : 'Teléfono', data.phone),
    sectionHeader(isEn ? 'Message' : 'Mensaje'),
    row(isEn ? 'Message' : 'Mensaje', data.message),
    row(isEn ? 'Language' : 'Idioma', isEn ? 'EN' : 'ES'),
  ].join('');
  return {
    subject: `[Toromac] ${isEn ? 'New contact' : 'Nuevo contacto'} — ${data.name}`,
    html: shell({ title, intro, rows }),
    text: [
      `${isEn ? 'New contact' : 'Nuevo contacto'}: ${data.name}`,
      `Email: ${data.email}`,
      `${isEn ? 'Phone' : 'Teléfono'}: ${data.phone}`,
      '',
      data.message,
    ].join('\n'),
  };
}

const SECTOR_LABELS = {
  alimentaria: { es: 'Alimentaria', en: 'Food' },
  farma: { es: 'Farma / Nutracéutica', en: 'Pharma / Nutraceutical' },
  quimica: { es: 'Química', en: 'Chemical' },
  'nutricion-animal': { es: 'Nutrición animal', en: 'Animal nutrition' },
  otro: { es: 'Otro', en: 'Other' },
};

export function renderQuoteEmail(data, productLookup = {}) {
  const isEn = data.lang === 'en';
  const product = productLookup[data.productId] || {};
  const productName = product.name?.[data.lang] || product.name?.es || data.productId;
  const sectorLabel = SECTOR_LABELS[data.sector]?.[data.lang] || data.sector;

  const title = isEn ? 'New quote request' : 'Nuevo presupuesto';
  const intro = isEn
    ? `${data.name} from ${data.company} requested a technical proposal for ${productName}.`
    : `${data.name} de ${data.company} solicita propuesta técnica para ${productName}.`;

  const rows = [
    sectionHeader(isEn ? 'Lead' : 'Datos de contacto'),
    row(isEn ? 'Name' : 'Nombre', data.name),
    row(isEn ? 'Company' : 'Empresa', data.company),
    row('Email', data.email),
    row(isEn ? 'Phone' : 'Teléfono', data.phone),
    row(isEn ? 'Country' : 'País', data.country),

    sectionHeader(isEn ? 'Product of interest' : 'Producto de interés'),
    row(isEn ? 'Category' : 'Categoría', data.category),
    row(isEn ? 'Product' : 'Producto', productName),
    row(isEn ? 'Product ID' : 'ID producto', data.productId),

    sectionHeader(isEn ? 'Application' : 'Aplicación'),
    row(isEn ? 'Sector' : 'Sector', sectorLabel),
    row(isEn ? 'Product to handle' : 'Producto a manipular', data.productHandled),
    row(isEn ? 'Required capacity' : 'Capacidad necesaria', data.capacity),

    data.message
      ? sectionHeader(isEn ? 'Additional message' : 'Mensaje adicional') + row(isEn ? 'Message' : 'Mensaje', data.message)
      : '',
    row(isEn ? 'Language' : 'Idioma', isEn ? 'EN' : 'ES'),
  ].join('');

  return {
    subject: `[Toromac] ${isEn ? 'New quote' : 'Nuevo presupuesto'} — ${data.name} · ${data.company}`,
    html: shell({ title, intro, rows, footerNote: 'Plazo objetivo de respuesta: 48 horas habiles.' }),
    text: [
      `${isEn ? 'New quote request' : 'Nuevo presupuesto'} — ${data.name} · ${data.company}`,
      `${productName} (${data.productId})`,
      '',
      `Email: ${data.email}`,
      `${isEn ? 'Phone' : 'Teléfono'}: ${data.phone}`,
      data.country && `${isEn ? 'Country' : 'País'}: ${data.country}`,
      '',
      `${isEn ? 'Sector' : 'Sector'}: ${sectorLabel}`,
      `${isEn ? 'Product to handle' : 'Producto a manipular'}: ${data.productHandled}`,
      data.capacity && `${isEn ? 'Capacity' : 'Capacidad'}: ${data.capacity}`,
      data.message && `\n${data.message}`,
    ].filter(Boolean).join('\n'),
  };
}
