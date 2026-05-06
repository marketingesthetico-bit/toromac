import { useTranslation } from 'react-i18next';

export default function PageStub({ titleKey, lang }) {
  const { t } = useTranslation();
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-widest text-toro-gray-mid mb-3">
        {lang.toUpperCase()} · {t('common.comingSoon')}
      </p>
      <h1 className="font-heading text-3xl md:text-5xl font-bold text-toro-black">
        {t(titleKey)}
      </h1>
      <p className="mt-4 max-w-xl text-toro-gray-mid">
        Página en construcción. Esta ruta resuelve correctamente y se completará en una fase posterior.
      </p>
    </main>
  );
}
