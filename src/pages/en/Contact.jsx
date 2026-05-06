import { useTranslation } from 'react-i18next';
import { Mail, Clock, MapPin } from 'lucide-react';
import PageSeo from '../../components/seo/PageSeo';
import Container from '../../components/ui/Container';
import HeroSection from '../../components/marketing/HeroSection';
import ContactForm from '../../components/forms/ContactForm';
import { localBusinessSchema, breadcrumbSchema, ORG } from '../../utils/schema';

export default function ContactEn() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/en' },
    { name: t('contact.breadcrumb'), path: '/en/contact' },
  ];

  return (
    <>
      <PageSeo
        title={t('contact.seo.title')}
        description={t('contact.seo.description')}
        type="website"
        schema={[localBusinessSchema(), breadcrumbSchema(breadcrumb)]}
      />
      <HeroSection i18nKey="contact.hero" breadcrumbPath="/en/contact" breadcrumbLabel={t('contact.breadcrumb')} />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-5 space-y-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue mb-3">
                  Toromac · Direct contact
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-tight">
                  One person, not a generic inbox.
                </h2>
              </div>

              <ul className="space-y-5">
                <ContactRow icon={Mail} label={t('contact.info.emailLabel')}>
                  <a href={`mailto:${ORG.email}`} className="text-toro-black hover:text-toro-blue transition-colors">
                    {ORG.email}
                  </a>
                </ContactRow>
                <ContactRow icon={Clock} label={t('contact.info.hoursLabel')}>
                  <span className="text-toro-black">{t('contact.info.hoursValue')}</span>
                </ContactRow>
                <ContactRow icon={MapPin} label={t('contact.info.addressLabel')}>
                  <span className="text-toro-black">{t('contact.info.addressValue')}</span>
                </ContactRow>
              </ul>

              <div className="rounded-xl border border-toro-black/10 bg-toro-gray-cold p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-toro-blue mb-2">
                  Response commitment
                </p>
                <p className="text-sm text-toro-black/80 leading-relaxed">
                  Average reply within 48 working hours. If you need a custom unit, we put you in contact with process engineering that same day.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <div className="space-y-2 mb-6">
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-tight">{t('contact.form.title')}</h2>
                <p className="text-sm text-toro-gray-mid">{t('contact.form.subtitle')}</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-toro-blue/10 text-toro-blue">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-toro-gray-mid mb-0.5">{label}</p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </li>
  );
}
