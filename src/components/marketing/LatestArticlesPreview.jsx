import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ArticleCard from '../ui/ArticleCard';
import { useLang } from '../../hooks/useLang';

// Placeholder hasta que existan articulos reales (Fase 6).
const PLACEHOLDER_ARTICLES = [
  {
    id: 'guia-tipos-cangilones-elevadores',
    slug: { es: 'guia-tipos-cangilones-elevadores', en: 'guide-bucket-types-elevators' },
    publishedAt: '2026-04-12T10:00:00Z',
    category: { es: 'Cangilones', en: 'Buckets' },
    title: {
      es: 'Guía completa sobre tipos de cangilones para elevadores',
      en: 'Complete guide to bucket types for elevators',
    },
    metaDescription: {
      es: 'Comparativa técnica de cangilones por material, geometría y aplicación. Criterios de selección para ingeniería de proceso.',
      en: 'Technical comparison of buckets by material, geometry and application. Selection criteria for process engineering.',
    },
  },
  {
    id: 'elevador-z-seleccion-comparativa',
    slug: { es: 'elevador-cangilones-tipo-z-seleccion', en: 'z-type-bucket-elevator-selection' },
    publishedAt: '2026-03-28T10:00:00Z',
    category: { es: 'Elevación', en: 'Elevation' },
    title: {
      es: 'Elevador de cangilones tipo Z: guía de selección y comparativa',
      en: 'Z-type bucket elevator: selection guide and comparison',
    },
    metaDescription: {
      es: 'Cuándo elegir un elevador tipo Z frente a tipo C u O. Capacidad, ocupación de espacio y consumo energético.',
      en: 'When to pick a Z-type elevator over C-type or O-type. Capacity, footprint and energy consumption.',
    },
  },
  {
    id: 'checklist-mantenimiento-elevadores',
    slug: { es: 'checklist-mantenimiento-elevadores-cangilones', en: 'maintenance-checklist-bucket-elevators' },
    publishedAt: '2026-03-10T10:00:00Z',
    category: { es: 'Mantenimiento', en: 'Maintenance' },
    title: {
      es: 'Checklist de mantenimiento para elevadores de cangilones',
      en: 'Maintenance checklist for bucket elevators',
    },
    metaDescription: {
      es: 'Inspecciones diarias, semanales y trimestrales para alargar la vida útil del equipo y reducir paradas no programadas.',
      en: 'Daily, weekly and quarterly inspections to extend equipment life and reduce unplanned downtime.',
    },
  },
];

export default function LatestArticlesPreview() {
  const { t } = useTranslation();
  const { lang, isEn } = useLang();
  const newsHref = isEn ? '/en/news' : '/novedades';

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="space-y-5 max-w-2xl">
            <Eyebrow className="text-toro-blue">{t('home.news.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('home.news.headline')}
            </h2>
            <p className="text-toro-gray-mid leading-relaxed text-pretty">
              {t('home.news.lead')}
            </p>
          </div>
          <Link
            to={newsHref}
            className="inline-flex items-center gap-2 self-start lg:self-end text-sm font-medium text-toro-blue hover:gap-3 transition-all"
          >
            {t('home.news.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_ARTICLES.map((a) => (
            <ArticleCard
              key={a.id}
              article={a}
              lang={lang}
              categoryLabel={a.category[lang] || a.category.es}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
