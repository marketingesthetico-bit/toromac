import { useTranslation } from 'react-i18next';
import PageSeo from '../../components/seo/PageSeo';
import HeroHome from '../../components/marketing/HeroHome';
import SectorsBlock from '../../components/marketing/SectorsBlock';
import FeaturedProducts from '../../components/marketing/FeaturedProducts';
import ClientsBlock from '../../components/marketing/ClientsBlock';
import CtaBand from '../../components/marketing/CtaBand';
import LatestArticlesPreview from '../../components/marketing/LatestArticlesPreview';
import { organizationSchema, websiteSchema } from '../../utils/schema';

export default function HomeEn() {
  const { t } = useTranslation();
  return (
    <>
      <PageSeo
        title={t('home.seo.title')}
        description={t('home.seo.description')}
        type="website"
        schema={[organizationSchema(), websiteSchema('en')]}
      />
      <HeroHome />
      <SectorsBlock />
      <FeaturedProducts />
      <ClientsBlock />
      <CtaBand i18nKey="home.ctaBand" />
      <LatestArticlesPreview />
    </>
  );
}
