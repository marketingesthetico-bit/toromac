import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ProductCard from '../ui/ProductCard';
import { useLang } from '../../hooks/useLang';

// Datos placeholder para Fase 3. En Fase 4 se reemplaza por products.json + useProducts.
const FEATURED = [
  {
    id: 'elevador-cangilones-tipo-z',
    slug: { es: 'elevador-cangilones-tipo-z', en: 'z-type-bucket-elevator' },
    category: { es: 'Elevación y transporte', en: 'Elevation & Transport' },
    name: { es: 'Elevador de Cangilones Tipo Z', en: 'Z-Type Bucket Elevator' },
    shortDescription: {
      es: 'Elevación compacta para sólidos y granulados con cuidado máximo del producto y bajo consumo energético.',
      en: 'Compact elevation for solids and granulates with maximum product care and low energy consumption.',
    },
  },
  {
    id: 'cinta-transportadora-banda',
    slug: { es: 'cinta-transportadora-banda-industrial', en: 'industrial-belt-conveyor' },
    category: { es: 'Elevación y transporte', en: 'Elevation & Transport' },
    name: { es: 'Cinta Transportadora de Banda Industrial', en: 'Industrial Belt Conveyor' },
    shortDescription: {
      es: 'Transporte horizontal y en pendiente para producto a granel. Configuraciones modulares según layout de planta.',
      en: 'Horizontal and inclined transport for bulk product. Modular configurations to match plant layout.',
    },
  },
  {
    id: 'tamizadora-centrifuga-tc1000',
    slug: { es: 'tamizadora-centrifuga-tc1000', en: 'centrifugal-sifter-tc1000' },
    category: { es: 'Procesado', en: 'Process Equipment' },
    name: { es: 'Tamizadora Centrífuga TC1000', en: 'Centrifugal Sifter TC1000' },
    shortDescription: {
      es: 'Cribado de seguridad y separación granulométrica para alta capacidad. Acabado sanitario opcional.',
      en: 'Safety screening and particle separation at high capacity. Optional sanitary finish.',
    },
  },
  {
    id: 'cangilones-calyon-x',
    slug: { es: 'cangilon-calyon-x-metal-detectable', en: 'calyon-x-metal-detectable-bucket' },
    category: { es: 'Recambios CALYON', en: 'CALYON Spare Buckets' },
    name: { es: 'Cangilón CALYON X Metal-Detectable', en: 'CALYON X Metal-Detectable Bucket' },
    shortDescription: {
      es: 'Cangilón detectable por metales para entornos críticos en alimentación y farma. Disponible 2L–10L.',
      en: 'Metal-detectable bucket for critical food and pharma environments. Available 2L–10L.',
    },
  },
  {
    id: 'elevador-sinfin',
    slug: { es: 'elevador-sinfin', en: 'screw-conveyor-elevator' },
    category: { es: 'Elevación y transporte', en: 'Elevation & Transport' },
    name: { es: 'Elevador Sin-Fin', en: 'Screw Conveyor Elevator' },
    shortDescription: {
      es: 'Tornillo sin-fin para producto en polvo y granulado, con sellado higiénico y mínima generación de polvo.',
      en: 'Screw conveyor for powder and granulate, with hygienic sealing and minimal dust generation.',
    },
  },
  {
    id: 'soporte-big-bags',
    slug: { es: 'soporte-big-bags', en: 'big-bag-support' },
    category: { es: 'Dosificación', en: 'Dosing' },
    name: { es: 'Soporte para Big Bags', en: 'Big Bag Support' },
    shortDescription: {
      es: 'Estación de descarga y soporte para Big Bags con manga de descarga, vibración opcional y captación de polvo.',
      en: 'Discharge station for Big Bags with outlet sleeve, optional vibration and dust extraction.',
    },
  },
];

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const productsHref = isEn ? '/en/products' : '/productos';

  return (
    <section className="bg-toro-gray-cold">
      <Container className="py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="space-y-5 max-w-2xl">
            <Eyebrow className="text-toro-blue">{t('home.products.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('home.products.headline')}
            </h2>
            <p className="text-toro-gray-mid leading-relaxed text-pretty">
              {t('home.products.lead')}
            </p>
          </div>
          <Link
            to={productsHref}
            className="inline-flex items-center gap-2 self-start lg:self-end text-sm font-medium text-toro-blue hover:gap-3 transition-all"
          >
            {t('home.products.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              lang={lang}
              categoryLabel={p.category[lang] || p.category.es}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
