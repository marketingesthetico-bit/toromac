import { Link } from 'react-router-dom';
import { Mail, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../hooks/useLang';
import Container from '../ui/Container';
import { ORG } from '../../utils/schema';

export default function Footer() {
  const { t } = useTranslation();
  const { isEn } = useLang();
  const year = new Date().getFullYear();

  const productLinks = isEn
    ? [
        { to: '/en/products', label: t('nav.products') },
        { to: '/en/products?category=elevacion-transporte', label: 'Elevation & Transport' },
        { to: '/en/products?category=recambios-cangilones', label: 'Buckets & Spare Parts' },
        { to: '/en/products?category=procesado', label: 'Process Equipment' },
      ]
    : [
        { to: '/productos', label: t('nav.products') },
        { to: '/productos?category=elevacion-transporte', label: 'Elevación y transporte' },
        { to: '/productos?category=recambios-cangilones', label: 'Recambios y cangilones' },
        { to: '/productos?category=procesado', label: 'Equipos de procesado' },
      ];

  const companyLinks = isEn
    ? [
        { to: '/en/company', label: t('nav.company') },
        { to: '/en/news', label: t('nav.news') },
        { to: '/en/contact', label: t('nav.contact') },
        { to: '/en/quote', label: t('nav.quote') },
      ]
    : [
        { to: '/compania', label: t('nav.company') },
        { to: '/novedades', label: t('nav.news') },
        { to: '/contacto', label: t('nav.contact') },
        { to: '/presupuesto', label: t('nav.quote') },
      ];

  const legalLinks = isEn
    ? [
        { to: '/en/legal', label: t('footer.legal') },
        { to: '/en/privacy', label: t('footer.privacy') },
        { to: '/en/cookies', label: t('footer.cookies') },
      ]
    : [
        { to: '/aviso-legal', label: t('footer.legal') },
        { to: '/politica-privacidad', label: t('footer.privacy') },
        { to: '/politica-cookies', label: t('footer.cookies') },
      ];

  return (
    <footer className="bg-toro-black text-white/80">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to={isEn ? '/en' : '/'} className="inline-block">
              <img
                src="/images/brand/icon-toromac.svg"
                alt="Toromac"
                width="48"
                height="48"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {ORG.email && (
                <a
                  href={`mailto:${ORG.email}`}
                  aria-label="Email"
                  className="grid h-9 w-9 place-items-center rounded-md border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                </a>
              )}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-md border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <FooterColumn title={t('footer.products')} links={productLinks} />
          <FooterColumn title={t('footer.company')} links={companyLinks} />

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              {t('footer.contact')}
            </h3>
            {ORG.email && (
              <a
                href={`mailto:${ORG.email}`}
                className="block text-sm text-white/70 hover:text-white"
              >
                {ORG.email}
              </a>
            )}
            <p className="text-xs text-white/50 leading-relaxed">
              {ORG.legalName}
              <br />
              {isEn ? `${ORG.foundingYear}+ in food industry engineering` : `Desde ${ORG.foundingYear}`}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {year} {ORG.name}. {t('footer.rights')}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/50 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-white/70 hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
