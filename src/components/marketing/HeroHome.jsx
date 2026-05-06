import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import Stats from './Stats';
import BullDecoration from './BullDecoration';
import { useLang } from '../../hooks/useLang';

export default function HeroHome() {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const productsHref = isEn ? '/en/products' : '/productos';
  const quoteHref = isEn ? '/en/quote' : '/presupuesto';

  return (
    <section className="relative overflow-hidden bg-blueprint text-white">
      {/* Toro silueta como elemento grafico oversized */}
      <BullDecoration className="pointer-events-none absolute -right-32 top-8 h-[36rem] w-[36rem] text-white/[0.05] lg:-right-20 lg:top-12 lg:h-[44rem] lg:w-[44rem]" />

      {/* Crosshair decorativo top-right */}
      <div
        aria-hidden
        className="absolute right-6 top-6 hidden h-12 w-12 lg:block"
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
      </div>

      <Container className="relative z-10 pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9 space-y-7 animate-fade-up">
            <Eyebrow className="text-toro-blue-light">{t('home.hero.eyebrow')}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight text-balance">
              {t('home.hero.headline')}
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl leading-relaxed text-pretty">
              {t('home.hero.subhead')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button to={quoteHref} variant="primary" size="lg" withArrow>
                {t('home.hero.ctaPrimary')}
              </Button>
              <Button to={productsHref} variant="outline" size="lg">
                {t('home.hero.ctaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Strip de stats inferior con bordes finos */}
      <div className="relative z-10 border-t border-white/10">
        <Container className="px-0 lg:px-0">
          <Stats tone="dark" />
        </Container>
      </div>
    </section>
  );
}
