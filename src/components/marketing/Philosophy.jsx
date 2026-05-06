import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';

export default function Philosophy() {
  const { t } = useTranslation();
  const items = t('company.philosophy.items', { returnObjects: true });

  return (
    <section className="bg-white">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end mb-14">
          <div className="lg:col-span-7 space-y-5">
            <Eyebrow className="text-toro-blue">{t('company.philosophy.eyebrow')}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t('company.philosophy.headline')}
            </h2>
          </div>
        </div>

        <ol className="space-y-px">
          {Array.isArray(items) &&
            items.map((item, idx) => (
              <li
                key={idx}
                className="group grid grid-cols-[auto_1fr] gap-6 lg:gap-12 border-t border-toro-black/10 py-8 lg:py-12 last:border-b"
              >
                <span className="font-mono text-sm font-medium text-toro-blue tabular-nums">
                  0{idx + 1}
                </span>
                <div className="grid gap-3 lg:grid-cols-12 lg:gap-12 lg:items-start">
                  <h3 className="font-display text-xl lg:text-3xl font-bold leading-tight text-toro-black lg:col-span-5 text-balance">
                    {item.title}
                  </h3>
                  <p className="text-toro-gray-mid leading-relaxed text-pretty lg:col-span-7 lg:text-lg">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
        </ol>
      </Container>
    </section>
  );
}
