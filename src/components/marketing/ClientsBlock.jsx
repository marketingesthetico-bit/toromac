import { useTranslation } from 'react-i18next';
import Container from '../ui/Container';
import Eyebrow from './Eyebrow';
import ClientLogos from './ClientLogos';

export default function ClientsBlock({ i18nKey = 'home.clients' }) {
  const { t } = useTranslation();
  return (
    <section className="bg-white border-y border-toro-black/[0.06]">
      <Container className="py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end mb-12">
          <div className="lg:col-span-6 space-y-5">
            <Eyebrow className="text-toro-blue">{t(`${i18nKey}.eyebrow`)}</Eyebrow>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
              {t(`${i18nKey}.headline`)}
            </h2>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-toro-gray-mid leading-relaxed text-pretty">
            {t(`${i18nKey}.lead`)}
          </p>
        </div>

        <ClientLogos />
      </Container>
    </section>
  );
}
