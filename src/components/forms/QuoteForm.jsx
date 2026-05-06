import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation, Trans } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { quoteSchema, quoteStepSchemas } from '../../utils/validation';
import { TextField, TextareaField, SelectField, CheckboxField, Honeypot } from './Field';
import Button from '../ui/Button';
import { useLang } from '../../hooks/useLang';
import { CATEGORIES, getAllProducts } from '../../hooks/useProducts';
import { SuccessPanel, ErrorPanel } from './ContactForm';

const STEPS = ['step1', 'step2', 'step3'];
const SECTOR_VALUES = ['alimentaria', 'farma', 'quimica', 'nutricion-animal', 'otro'];

export default function QuoteForm() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const [params] = useSearchParams();
  const allProducts = useMemo(() => getAllProducts(), []);

  // Permite prefilling desde un link como /presupuesto?product=elevador-cangilones-tipo-z
  const prefilledProductId = params.get('product') || '';
  const prefilledProduct = allProducts.find((p) => p.id === prefilledProductId);
  const prefilledCategory = prefilledProduct?.category || '';

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle');
  const privacyHref = isEn ? '/en/privacy' : '/politica-privacidad';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      lang,
      website: '',
      category: prefilledCategory,
      productId: prefilledProductId,
      sector: '',
      productHandled: '',
      capacity: '',
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const watchCategory = watch('category');
  const filteredProducts = useMemo(
    () => (watchCategory ? allProducts.filter((p) => p.category === watchCategory) : allProducts),
    [allProducts, watchCategory]
  );

  // Reset productId si la categoria cambia y el producto previo no encaja
  function handleCategoryChange(e) {
    const next = e.target.value;
    setValue('category', next, { shouldValidate: false });
    const current = watch('productId');
    if (current && !allProducts.find((p) => p.id === current && p.category === next)) {
      setValue('productId', '', { shouldValidate: false });
    }
  }

  async function nextStep() {
    const fields = Object.keys(quoteStepSchemas[STEPS[step]].shape);
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function onSubmit(values) {
    setStatus('submitting');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        reset();
        setStep(0);
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
        title={t('form.successQuoteTitle')}
        text={t('form.successQuoteText')}
        onReset={() => setStatus('idle')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-8">
      <Honeypot {...register('website')} />

      <Stepper currentStep={step} />

      {step === 0 && (
        <fieldset className="space-y-5">
          <SelectField
            id="quote-category"
            label={t('form.fields.category')}
            required
            error={errors.category?.message}
            {...register('category')}
            onChange={handleCategoryChange}
          >
            <option value="">{t('form.fields.categoryPh')}</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label[lang] || c.label.es}</option>
            ))}
          </SelectField>

          <SelectField
            id="quote-product"
            label={t('form.fields.product')}
            required
            error={errors.productId?.message}
            {...register('productId')}
          >
            <option value="">{t('form.fields.productPh')}</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name?.[lang] || p.name?.es}</option>
            ))}
          </SelectField>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="space-y-5">
          <SelectField
            id="quote-sector"
            label={t('form.fields.sector')}
            required
            error={errors.sector?.message}
            {...register('sector')}
          >
            <option value="">{t('form.fields.sectorPh')}</option>
            {SECTOR_VALUES.map((s) => (
              <option key={s} value={s}>{t(`form.sectors.${s}`)}</option>
            ))}
          </SelectField>

          <TextField
            id="quote-product-handled"
            label={t('form.fields.productHandled')}
            required
            placeholder={t('form.fields.productHandledPh')}
            error={errors.productHandled?.message}
            {...register('productHandled')}
          />

          <TextField
            id="quote-capacity"
            label={t('form.fields.capacity')}
            optional
            placeholder={t('form.fields.capacityPh')}
            error={errors.capacity?.message}
            {...register('capacity')}
          />
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="quote-name"
              label={t('form.fields.name')}
              required
              autoComplete="name"
              placeholder={t('form.fields.namePh')}
              error={errors.name?.message}
              {...register('name')}
            />
            <TextField
              id="quote-company"
              label={t('form.fields.company')}
              required
              autoComplete="organization"
              placeholder={t('form.fields.companyPh')}
              error={errors.company?.message}
              {...register('company')}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="quote-email"
              label={t('form.fields.email')}
              type="email"
              required
              autoComplete="email"
              placeholder={t('form.fields.emailPh')}
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              id="quote-phone"
              label={t('form.fields.phone')}
              type="tel"
              required
              autoComplete="tel"
              placeholder={t('form.fields.phonePh')}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <TextField
            id="quote-country"
            label={t('form.fields.country')}
            optional
            autoComplete="country-name"
            placeholder={t('form.fields.countryPh')}
            error={errors.country?.message}
            {...register('country')}
          />

          <TextareaField
            id="quote-message"
            label={t('form.fields.message')}
            optional
            rows={4}
            placeholder={t('form.fields.messagePh')}
            error={errors.message?.message}
            {...register('message')}
          />

          <CheckboxField
            id="quote-legal"
            label={
              <Trans i18nKey="form.legal">
                He leído y acepto la <Link to={privacyHref} className="underline hover:text-toro-blue">política de privacidad</Link>.
              </Trans>
            }
            error={errors.legalAccepted?.message}
            {...register('legalAccepted')}
          />
        </fieldset>
      )}

      {status === 'error' && (
        <ErrorPanel title={t('form.errorTitle')} text={t('form.errorText')} />
      )}

      {/* Navegacion entre pasos */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-toro-black/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-toro-gray-mid hover:text-toro-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t('form.stepBack')}
          </button>
        ) : <span />}

        {step < STEPS.length - 1 ? (
          <Button as="button" type="button" onClick={nextStep} variant="primary" size="md" withArrow>
            {t('form.stepNext')}
          </Button>
        ) : (
          <Button as="button" type="submit" variant="primary" size="lg" withArrow disabled={status === 'submitting'}>
            {status === 'submitting' ? t('form.submitting') : t('form.submitQuote')}
          </Button>
        )}
      </div>
    </form>
  );
}

function Stepper({ currentStep }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue">
          {t('form.step', { current: currentStep + 1, total: STEPS.length })}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-gray-mid">
          {t(`form.stepLabels.${STEPS[currentStep]}`)}
        </span>
      </div>
      {/* Barra segmentada */}
      <div className="grid grid-cols-3 gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-toro-blue' : 'bg-toro-black/10'
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
