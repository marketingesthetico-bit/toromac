import { useTranslation } from 'react-i18next';
import { Clock, FileCheck, Wrench } from 'lucide-react';
import PageSeo from '../../components/seo/PageSeo';
import Container from '../../components/ui/Container';
import HeroSection from '../../components/marketing/HeroSection';
import QuoteForm from '../../components/forms/QuoteForm';
import { breadcrumbSchema } from '../../utils/schema';

export default function QuoteEn() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/en' },
    { name: t('quote.breadcrumb'), path: '/en/quote' },
  ];

  return (
    <>
      <PageSeo
        title={t('quote.seo.title')}
        description={t('quote.seo.description')}
        type="website"
        schema={breadcrumbSchema(breadcrumb)}
      />
      <HeroSection i18nKey="quote.hero" breadcrumbPath="/en/quote" breadcrumbLabel={t('quote.breadcrumb')} />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <QuoteForm />
            </div>

            <aside className="lg:col-span-5 lg:order-first">
              <div className="lg:sticky lg:top-24 space-y-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue">
                  How it works
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-tight">
                  From request to technical proposal in 48 h.
                </h2>

                <ul className="space-y-5 pt-2">
                  <Step n="01" icon={Wrench} title="Quick configurator">
                    Product to handle, required capacity and sector. Three steps, two minutes.
                  </Step>
                  <Step n="02" icon={Clock} title="Reply in 48 hours">
                    The engineer in charge of your project replies — not a salesperson.
                  </Step>
                  <Step n="03" icon={FileCheck} title="Auditable proposal">
                    Specifications, materials, lead time and price in a single document.
                  </Step>
                </ul>

                <div className="rounded-xl bg-toro-black p-5 text-white">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1.5">
                    You don't need to fill everything
                  </p>
                  <p className="text-sm leading-relaxed text-white/85">
                    If you don't know the capacity or sector yet, leave them blank. We'll call you to scope it together.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

function Step({ n, icon: Icon, title, children }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-toro-blue/10 text-toro-blue">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-toro-blue">{n}</span>
          <h3 className="font-display text-base font-bold">{title}</h3>
        </div>
        <p className="text-sm text-toro-gray-mid leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
