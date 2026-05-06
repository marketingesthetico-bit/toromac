import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';

export default function WhyToromac() {
  const { t } = useTranslation();
  const items = t('company.why.items', { returnObjects: true });

  return (
    <section className="bg-toro-gray-cold border-y border-toro-black/[0.06]">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end mb-14">
          <div className="lg:col-span-7 space-y-5">
            <Eyebrow className="text-toro-blue">{t('company.why.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('company.why.headline')}
            </h2>
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-xl border border-toro-black/10 bg-toro-black/10 sm:grid-cols-2">
          {Array.isArray(items) &&
            items.map((item) => (
              <li
                key={item.number}
                className="group relative flex flex-col gap-4 bg-white p-8 lg:p-10 transition-colors hover:bg-toro-blue/[0.02]"
              >
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-toro-blue">
                  {item.number}
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight text-toro-black">
                  {item.title}
                </h3>
                <p className="text-toro-gray-mid leading-relaxed text-pretty">
                  {item.body}
                </p>
              </li>
            ))}
        </ul>
      </Container>
    </section>
  );
}
