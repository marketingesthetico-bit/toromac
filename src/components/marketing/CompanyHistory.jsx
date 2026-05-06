import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';

export default function CompanyHistory() {
  const { t } = useTranslation();
  const paragraphs = t('company.history.paragraphs', { returnObjects: true });

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 space-y-5">
            <Eyebrow className="text-toro-blue">{t('company.history.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold leading-[1.05] text-balance">
              {t('company.history.headline')}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 space-y-6 text-toro-black/85 text-lg leading-relaxed text-pretty">
            {Array.isArray(paragraphs) &&
              paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:font-display first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-toro-blue first-letter:pt-1' : ''}>
                  {p}
                </p>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
