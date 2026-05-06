import { Cookie, FlaskConical, Beaker, PawPrint } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProductCard from '../components/ui/ProductCard';
import ArticleCard from '../components/ui/ArticleCard';
import SectorCard from '../components/ui/SectorCard';
import Breadcrumb from '../components/layout/Breadcrumb';
import PageSeo from '../components/seo/PageSeo';

const sampleProduct = {
  id: 'elevador-cangilones-tipo-z',
  slug: { es: 'elevador-cangilones-tipo-z', en: 'z-type-bucket-elevator' },
  category: 'elevacion-transporte',
  name: {
    es: 'Elevador de Cangilones Tipo Z',
    en: 'Z-Type Bucket Elevator',
  },
  shortDescription: {
    es: 'Solución de elevación compacta para productos sólidos y granulados con cuidado máximo del producto y bajo consumo energético.',
    en: 'Compact elevation solution for solid and granular products with maximum product care and low energy consumption.',
  },
  image: '',
  imageAlt: { es: 'Elevador tipo Z', en: 'Z-type bucket elevator' },
};

const sampleArticle = {
  id: 'guia-tipos-cangilones-elevadores',
  slug: { es: 'guia-tipos-cangilones-elevadores', en: 'guide-types-bucket-elevators' },
  publishedAt: '2026-04-12T10:00:00Z',
  title: {
    es: 'Guía completa sobre tipos de cangilones para elevadores',
    en: 'Complete guide to bucket types for elevators',
  },
  metaDescription: {
    es: 'Comparativa técnica de cangilones por material, geometría y aplicación industrial. Criterios de selección para ingenieros de proceso.',
    en: 'Technical comparison of buckets by material, geometry and industrial application. Selection criteria for process engineers.',
  },
  heroImage: '',
};

export default function DesignSystem() {
  return (
    <>
      <PageSeo title="Design System · Toromac" description="Sistema de diseño interno." noindex />
      <Container className="py-12 lg:py-16 space-y-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-toro-gray-mid">Internal · Dev only</p>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold">Toromac · Design System</h1>
          <p className="text-toro-gray-mid max-w-2xl">
            Vista de todos los componentes de UI con sus variantes. Esta página solo existe en
            desarrollo y se monta en <code className="text-toro-blue">/_design-system</code>.
          </p>
        </header>

        <Section title="Color tokens">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Swatch name="toro-black" hex="#0A0A0A" cls="bg-toro-black" />
            <Swatch name="toro-blue" hex="#2B4FBF" cls="bg-toro-blue" />
            <Swatch name="toro-blue-light" hex="#3D63D6" cls="bg-toro-blue-light" />
            <Swatch name="toro-blue-dark" hex="#1E3A8A" cls="bg-toro-blue-dark" />
            <Swatch name="toro-gray-cold" hex="#F4F4F6" cls="bg-toro-gray-cold border" />
            <Swatch name="toro-gray-mid" hex="#6B7280" cls="bg-toro-gray-mid" />
            <Swatch name="white" hex="#FFFFFF" cls="bg-white border" />
            <Swatch name="logo-azul" hex="#2954ae" cls="" style={{ background: '#2954ae' }} />
          </div>
        </Section>

        <Section title="Tipografía">
          <div className="space-y-4">
            <p className="font-heading text-5xl font-extrabold">Display 5xl · Inter 800</p>
            <p className="font-heading text-3xl font-bold">Heading 3xl · Inter 700</p>
            <p className="font-heading text-xl font-semibold">Heading xl · Inter 600</p>
            <p className="text-base">Body base · Inter 400. Tono técnico y clínico, sin retórica emocional.</p>
            <p className="text-sm text-toro-gray-mid">Body sm · Inter 400 secondary text.</p>
            <p className="text-xs uppercase tracking-widest text-toro-gray-mid">Caption uppercase tracked</p>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary CTA</Button>
            <Button variant="primary" withArrow>Primary con flecha</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="mt-4 rounded-xl bg-toro-black p-6 flex flex-wrap gap-3">
            <Button variant="outline">Outline on dark</Button>
            <Button variant="primary">Primary on dark</Button>
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="blue">Categoría</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="dark">Destacado</Badge>
          </div>
        </Section>

        <Section title="Breadcrumb">
          <Breadcrumb
            items={[
              { name: 'Inicio', path: '/' },
              { name: 'Productos', path: '/productos' },
              { name: 'Elevación y transporte', path: '/productos?category=elevacion-transporte' },
              { name: 'Elevador de Cangilones Tipo Z', path: '/productos/elevador-cangilones-tipo-z' },
            ]}
          />
        </Section>

        <Section title="ProductCard · ArticleCard">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard product={sampleProduct} lang="es" categoryLabel="Elevación y transporte" />
            <ProductCard product={sampleProduct} lang="en" categoryLabel="Elevation & Transport" />
            <ArticleCard article={sampleArticle} lang="es" categoryLabel="Cangilones" />
          </div>
        </Section>

        <Section title="SectorCard">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SectorCard
              icon={Cookie}
              title="Industria Alimentaria"
              items={['Snacks', 'Cereales', 'Frutos secos', 'Congelados']}
            />
            <SectorCard
              icon={FlaskConical}
              title="Farma & Nutracéutica"
              items={['Polvos sensibles', 'Manipulación higiénica', 'Acabados 304L / 316L']}
              accent
            />
            <SectorCard
              icon={Beaker}
              title="Industria Química"
              items={['Granulados', 'Manipulación controlada', 'Opciones ATEX']}
            />
            <SectorCard
              icon={PawPrint}
              title="Nutrición Animal"
              items={['Transporte eficiente', 'Mínimas roturas']}
            />
          </div>
        </Section>
      </Container>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-5">
      <div className="flex items-baseline gap-3 border-b border-toro-black/10 pb-2">
        <h2 className="font-heading text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, hex, cls, style }) {
  return (
    <div className="space-y-2">
      <div
        className={`h-20 w-full rounded-lg ${cls}`}
        style={style}
        aria-label={`${name} ${hex}`}
      />
      <div className="text-xs">
        <p className="font-medium text-toro-black">{name}</p>
        <p className="text-toro-gray-mid font-mono">{hex}</p>
      </div>
    </div>
  );
}
