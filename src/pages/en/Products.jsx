import { useTranslation } from 'react-i18next';
import PageSeo from '../../components/seo/PageSeo';
import ProductsCatalog from '../../components/marketing/ProductsCatalog';
import { breadcrumbSchema } from '../../utils/schema';

export default function ProductsEn() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/en' },
    { name: t('nav.products'), path: '/en/products' },
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
