import { useTranslation } from 'react-i18next';
import PageSeo from '../../components/seo/PageSeo';
import HeroCompany from '../../components/marketing/HeroCompany';
import CompanyHistory from '../../components/marketing/CompanyHistory';
import WhyToromac from '../../components/marketing/WhyToromac';
import SectorsBlock from '../../components/marketing/SectorsBlock';
import Philosophy from '../../components/marketing/Philosophy';
import ClientsBlock from '../../components/marketing/ClientsBlock';
import CtaBand from '../../components/marketing/CtaBand';
import { organizationSchema } from '../../utils/schema';

export default function CompaniaEs() {
  const { t } = useTranslation();
  return (
    <>
      <PageSeo
        title={t('company.seo.title')}
        description={t('company.seo.description')}
        type="website"
        schema={organizationSchema()}
      />
      <HeroCompany />
      <CompanyHistory />
      <WhyToromac />
      <SectorsBlock i18nKey="company.sectors" itemsKey="home.sectors.items" />
      <Philosophy />
      <ClientsBlock i18nKey="home.clients" />
      <CtaBand i18nKey="company.ctaBand" />
    </>
  );
}
