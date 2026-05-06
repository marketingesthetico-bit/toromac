import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import Stats from './Stats';
import { useLang } from '../../hooks/useLang';

export default function HeroHome() {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const productsHref = isEn ? '/en/products' : '/productos';
  const quoteHref = isEn ? '/en/quote' : '/presupuesto';

  return (
    <section className="relative overflow-hidden bg-blueprint text-white">
      {/* Spotlight detras del producto */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 lg:block"
        style={{
          background:
            'radial-gradient(ellipse at 65% 50%, rgba(43,79,191,0.18) 0%, rgba(10,10,10,0) 60%)',
        }}
      />

      {/* Crosshair decorativo top-right */}
      <div aria-hidden className="absolute right-6 top-6 hidden h-12 w-12 lg:block">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
        <div className="absolute -right-2 top-[calc(50%-7px)] font-mono text-[10px] text-white/40">+</div>
      </div>

      <Container className="relative z-10 pt-20 pb-0 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Texto */}
          <div className="lg:col-span-7 space-y-7 animate-fade-up">
            <Eyebrow className="text-toro-blue-light">{t('home.hero.eyebrow')}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight text-balance">
              {t('home.hero.headline')}
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-xl leading-relaxed text-pretty">
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

          {/* Imagen producto Z-elevator */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] -mx-6 lg:mx-0 lg:-mr-12">
              {/* Frame mark indicators tipo plano tecnico */}
              <span aria-hidden className="absolute -left-3 -top-3 hidden h-6 w-6 border-l-2 border-t-2 border-toro-blue lg:block" />
              <span aria-hidden className="absolute -right-3 -top-3 hidden h-6 w-6 border-r-2 border-t-2 border-toro-blue lg:block" />
              <span aria-hidden className="absolute -left-3 -bottom-3 hidden h-6 w-6 border-l-2 border-b-2 border-toro-blue lg:block" />
              <span aria-hidden className="absolute -right-3 -bottom-3 hidden h-6 w-6 border-r-2 border-b-2 border-toro-blue lg:block" />
              <img
                src="/images/hero/hero-elevador-z.jpg"
                alt="Elevador de cangilones tipo Z fabricado por Toromac"
                width="1080"
                height="608"
                className="h-full w-full object-cover object-center"
                loading="eager"
                fetchpriority="high"
              />
              {/* Vignette inferior para integrar con la siguiente seccion */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-toro-black/80" />
            </div>
          </div>
        </div>
      </Container>

      {/* Strip de stats inferior */}
      <div className="relative z-10 mt-12 lg:mt-16 border-t border-white/10">
        <Container className="px-0 lg:px-0">
          <Stats tone="dark" />
        </Container>
      </div>
    </section>
  );
}
