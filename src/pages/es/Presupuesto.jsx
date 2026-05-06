import { useTranslation } from 'react-i18next';
import { Clock, FileCheck, Wrench } from 'lucide-react';
import PageSeo from '../../components/seo/PageSeo';
import Container from '../../components/ui/Container';
import HeroSection from '../../components/marketing/HeroSection';
import QuoteForm from '../../components/forms/QuoteForm';
import { breadcrumbSchema } from '../../utils/schema';

export default function PresupuestoEs() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/' },
    { name: t('quote.breadcrumb'), path: '/presupuesto' },
  ];

  return (
    <>
      <PageSeo
        title={t('quote.seo.title')}
        description={t('quote.seo.description')}
        type="website"
        schema={breadcrumbSchema(breadcrumb)}
      />
      <HeroSection i18nKey="quote.hero" breadcrumbPath="/presupuesto" breadcrumbLabel={t('quote.breadcrumb')} />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <QuoteForm />
            </div>

            <aside className="lg:col-span-5 lg:order-first">
              <div className="lg:sticky lg:top-24 space-y-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue">
                  Cómo funciona
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-tight">
                  De solicitud a propuesta técnica en 48 h.
                </h2>

                <ul className="space-y-5 pt-2">
                  <Step n="01" icon={Wrench} title="Configurador rápido">
                    Producto a manipular, capacidad y sector. Tres pasos, dos minutos.
                  </Step>
                  <Step n="02" icon={Clock} title="Respuesta en 48 horas">
                    Le contesta el ingeniero responsable de su proyecto, no un comercial.
                  </Step>
                  <Step n="03" icon={FileCheck} title="Propuesta auditable">
                    Especificaciones, materiales, plazo y precio en un único documento.
                  </Step>
                </ul>

                <div className="rounded-xl bg-toro-black p-5 text-white">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1.5">
                    No es necesario rellenar todo
                  </p>
                  <p className="text-sm leading-relaxed text-white/85">
                    Si no conoce capacidad o sector, déjelo en blanco. Le llamaremos para definirlo conjuntamente.
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
