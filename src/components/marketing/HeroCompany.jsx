import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Eyebrow from './Eyebrow';
import Breadcrumb from '../layout/Breadcrumb';
import BullDecoration from './BullDecoration';
import { useLang } from '../../hooks/useLang';

export default function HeroCompany() {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const quoteHref = isEn ? '/en/quote' : '/presupuesto';
  const homeHref = isEn ? '/en' : '/';

  const breadcrumb = [
    { name: t('nav.home'), path: homeHref },
    { name: t('company.breadcrumb'), path: isEn ? '/en/company' : '/compania' },
  ];

  return (
    <section className="relative overflow-hidden bg-toro-black text-white">
      <BullDecoration className="pointer-events-none absolute -right-24 -top-12 h-[28rem] w-[28rem] text-white/[0.05] lg:-right-12 lg:h-[34rem] lg:w-[34rem]" />
      <Container className="relative z-10 pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="mb-8 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white [&_span[aria-current]]:text-white">
          <Breadcrumb items={breadcrumb} />
        </div>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9 space-y-7">
            <Eyebrow className="text-toro-blue-light">{t('company.hero.eyebrow')}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.02] tracking-tight text-balance">
              {t('company.hero.headline')}
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-3xl leading-relaxed text-pretty">
              {t('company.hero.subhead')}
            </p>
            <div className="pt-2">
              <Button to={quoteHref} variant="primary" size="lg" withArrow>
                {t('company.hero.ctaPrimary')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
