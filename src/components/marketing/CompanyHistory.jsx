import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';

export default function CompanyHistory() {
  const { t } = useTranslation();
  const paragraphs = t('company.history.paragraphs', { returnObjects: true });

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
          {/* Imagen vertical: operario montando equipo. Mantiene aspect ratio 3:4. */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative">
              <span aria-hidden className="absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-toro-blue" />
              <span aria-hidden className="absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-toro-blue" />
              <img
                src="/images/company/operario-montaje.jpg"
                alt="Operario Toromac montando un elevador de cangilones en planta"
                width="540"
                height="720"
                loading="lazy"
                className="aspect-[3/4] w-full object-cover bg-toro-gray-cold"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                <span className="rounded-sm bg-toro-black/80 px-2 py-1">Planta · Toromac</span>
                <span className="rounded-sm bg-toro-blue/90 px-2 py-1">Desde 1985</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Eyebrow className="text-toro-blue">{t('company.history.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('company.history.headline')}
            </h2>
            <div className="space-y-5 text-toro-black/85 text-lg leading-relaxed text-pretty pt-2">
              {Array.isArray(paragraphs) &&
                paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'first-letter:font-display first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-toro-blue first-letter:pt-1'
                        : ''
                    }
                  >
                    {p}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
