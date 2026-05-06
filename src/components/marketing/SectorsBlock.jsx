import { useTranslation } from 'react-i18next';
import { Cookie, FlaskConical, Beaker, PawPrint } from 'lucide-react';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import SectorCard from '../ui/SectorCard';

const ICONS = [Cookie, FlaskConical, Beaker, PawPrint];

export default function SectorsBlock({ i18nKey = 'home.sectors', itemsKey }) {
  const { t } = useTranslation();
  // En Compania reutilizamos los items de home.sectors pero con su propio
  // eyebrow/headline/lead. Por defecto los items vienen del mismo i18nKey.
  const items = t(`${itemsKey || `${i18nKey}.items`}`, { returnObjects: true });

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end mb-12">
          <div className="lg:col-span-7 space-y-5">
            <Eyebrow className="text-toro-blue">{t(`${i18nKey}.eyebrow`)}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t(`${i18nKey}.headline`)}
            </h2>
          </div>
          <p className="lg:col-span-5 text-toro-gray-mid leading-relaxed text-pretty">
            {t(`${i18nKey}.lead`)}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(items) &&
            items.map((sector, idx) => (
              <SectorCard
                key={sector.title}
                icon={ICONS[idx]}
                title={sector.title}
                items={sector.items}
                accent={idx === 1}
              />
            ))}
        </div>
      </Container>
    </section>
  );
}
