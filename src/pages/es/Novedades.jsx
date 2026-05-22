import { useTranslation } from 'react-i18next';
import PageSeo from '../../components/seo/PageSeo';
import NewsList from '../../components/marketing/NewsList';
import { breadcrumbSchema } from '../../utils/schema';

export default function NovedadesEs() {
  const { t } = useTranslation();
  const breadcrumb = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.news'), path: '/novedades' },
  ];
  return (
    <>
      <PageSeo
        title={t('news.seo.title')}
        description={t('news.seo.description')}
        type="website"
        schema={breadcrumbSchema(breadcrumb)}
      />
      <NewsList />
    </>
  );
}
