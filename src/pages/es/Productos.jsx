import { useTranslation } from 'react-i18next';
import PageSeo from '../../components/seo/PageSeo';
import ProductsCatalog from '../../components/marketing/ProductsCatalog';
import { breadcrumbSchema } from '../../utils/schema';

export default function ProductosEs() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/productos' },
  ];
  return (
    <>
      <PageSeo
        title={t('catalog.seo.title')}
        description={t('catalog.seo.description')}
        type="website"
        schema={breadcrumbSchema(breadcrumb)}
      />
      <ProductsCatalog />
    </>
  );
}
