import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import Breadcrumb from '../layout/Breadcrumb';
import { useLang } from '../../hooks/useLang';

/**
 * Hero compacto reutilizable para Contacto y Presupuesto: fondo oscuro,
 * breadcrumb, eyebrow, headline, lead. Sin imagen de fondo (queremos
 * carga rapida en estas paginas que tienen formularios pesados).
 */
export default function HeroSection({ i18nKey, breadcrumbPath, breadcrumbLabel }) {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const homeHref = isEn ? '/en' : '/';

  const breadcrumb = [
    { name: t('nav.home'), path: homeHref },
    { name: breadcrumbLabel, path: breadcrumbPath },
  ];

  return (
    <section className="relative overflow-hidden bg-blueprint text-white">
      <Container className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="mb-6 text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white [&_span[aria-current]]:text-white">
          <Breadcrumb items={breadcrumb} />
        </div>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9 space-y-5">
            <Eyebrow className="text-toro-blue-light">{t(`${i18nKey}.eyebrow`)}</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.02] tracking-tight text-balance">
              {t(`${i18nKey}.headline`)}
            </h1>
            <p className="text-lg text-white/70 max-w-3xl leading-relaxed text-pretty">
              {t(`${i18nKey}.lead`)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
