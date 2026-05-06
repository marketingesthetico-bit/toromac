import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import BullDecoration from './BullDecoration';
import { useLang } from '../../hooks/useLang';

/**
 * Banda CTA oscura con asimetria texto-izda + boton-derecha.
 * Lee del nodo i18n en `i18nKey` (ej: 'home.ctaBand' o 'company.ctaBand').
 */
export default function CtaBand({ i18nKey = 'home.ctaBand', toLink }) {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const href = toLink || (isEn ? '/en/quote' : '/presupuesto');

  return (
    <section className="relative overflow-hidden bg-blueprint text-white">
      <BullDecoration className="pointer-events-none absolute -right-24 -bottom-24 h-[28rem] w-[28rem] text-white/[0.04]" />
      <Container className="relative z-10 py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-5 max-w-2xl">
            <Eyebrow className="text-toro-blue-light/90">{t(`${i18nKey}.eyebrow`)}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t(`${i18nKey}.headline`)}
            </h2>
            <p className="text-white/65 text-lg max-w-xl leading-relaxed text-pretty">
              {t(`${i18nKey}.lead`)}
            </p>
          </div>
          <div className="lg:pb-2">
            <Button to={href} variant="primary" size="lg" withArrow>
              {t(`${i18nKey}.button`)}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
