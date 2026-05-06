import { z } from 'zod';

const stringMin = (min) => z.string().trim().min(min);
const stringMax = (max) => z.string().trim().max(max);

// Schemas compartidos entre cliente (formulario) y servidor (api/*)
// Para que la validacion sea consistente y no se pueda saltar desde el cliente.

export const contactSchema = z.object({
  name: stringMin(2).max(120),
  email: z.string().trim().email().max(180),
  phone: stringMin(6).max(40),
  message: stringMin(10).max(2000),
  legalAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar la política de privacidad' }),
  }),
  // Honeypot: si tiene valor, es bot.
  website: z.string().max(0).optional().default(''),
  // Idioma del navegador, util para responder en su idioma
  lang: z.enum(['es', 'en']).optional().default('es'),
});

export const quoteSchema = z.object({
  // Step 1
  category: z.string().trim().min(1).max(80),
  productId: z.string().trim().min(1).max(120),

  // Step 2
  sector: z.enum(['alimentaria', 'farma', 'quimica', 'nutricion-animal', 'otro']),
  productHandled: stringMin(2).max(200),
  capacity: stringMax(120).optional().default(''),

  // Step 3
  name: stringMin(2).max(120),
  company: stringMin(2).max(160),
  email: z.string().trim().email().max(180),
  phone: stringMin(6).max(40),
  country: stringMax(80).optional().default(''),
  message: stringMax(2000).optional().default(''),
  legalAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar la política de privacidad' }),
  }),
  website: z.string().max(0).optional().default(''),
  lang: z.enum(['es', 'en']).optional().default('es'),
});

// Schemas parciales para validar paso a paso en QuoteForm multi-step
export const quoteStepSchemas = {
  step1: quoteSchema.pick({ category: true, productId: true }),
  step2: quoteSchema.pick({ sector: true, productHandled: true, capacity: true }),
  step3: quoteSchema.pick({
    name: true,
    company: true,
    email: true,
    phone: true,
    country: true,
    message: true,
    legalAccepted: true,
  }),
};
