import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { contactSchema } from '../../utils/validation';
import { TextField, TextareaField, CheckboxField, Honeypot } from './Field';
import Button from '../ui/Button';
import { useLang } from '../../hooks/useLang';

export default function ContactForm() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const privacyHref = isEn ? '/en/privacy' : '/politica-privacidad';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { lang, website: '' },
  });

  async function onSubmit(values) {
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <SuccessPanel
        title={t('form.successTitle')}
        text={t('form.successText')}
        onReset={() => setStatus('idle')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <Honeypot {...register('website')} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          label={t('form.fields.name')}
          required
          autoComplete="name"
          placeholder={t('form.fields.namePh')}
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          id="contact-email"
          label={t('form.fields.email')}
          type="email"
          required
          autoComplete="email"
          placeholder={t('form.fields.emailPh')}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <TextField
        id="contact-phone"
        label={t('form.fields.phone')}
        type="tel"
        required
        autoComplete="tel"
        placeholder={t('form.fields.phonePh')}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <TextareaField
        id="contact-message"
        label={t('form.fields.message')}
        required
        rows={5}
        placeholder={t('form.fields.messagePh')}
        error={errors.message?.message}
        {...register('message')}
      />

      <CheckboxField
        id="contact-legal"
        label={
          <Trans i18nKey="form.legal">
            He leído y acepto la <Link to={privacyHref} className="underline hover:text-toro-blue">política de privacidad</Link>.
          </Trans>
        }
        error={errors.legalAccepted?.message}
        {...register('legalAccepted')}
      />

      {status === 'error' && (
        <ErrorPanel title={t('form.errorTitle')} text={t('form.errorText')} />
      )}

      <div className="pt-2">
        <Button
          as="button"
          type="submit"
          variant="primary"
          size="lg"
          withArrow
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? t('form.submitting') : t('form.submit')}
        </Button>
      </div>
    </form>
  );
}

export function SuccessPanel({ title, text, onReset }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-toro-blue/20 bg-toro-blue/[0.04] p-6 lg:p-8 space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-toro-blue text-white">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
        </span>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>
          <p className="text-toro-gray-mid leading-relaxed text-pretty">{text}</p>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-toro-blue hover:gap-2 transition-all pt-2"
            >
              {t('cta.viewMore')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorPanel({ title, text }) {
  return (
    <div role="alert" className="rounded-md border border-red-500/30 bg-red-50 p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-red-800">{title}</p>
        <p className="text-sm text-red-700">{text}</p>
      </div>
    </div>
  );
}
