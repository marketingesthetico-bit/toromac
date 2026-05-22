import { createContext, useContext, useEffect, useState } from 'react';

// Contexto para que las paginas de detalle (producto, articulo) publiquen sus
// rutas equivalentes por idioma { es, en }. El selector de idioma del Header
// las consume para navegar a la traduccion exacta en lugar de a la home.
const AlternatesContext = createContext({ overrides: null, setOverrides: () => {} });

export function AlternatesProvider({ children }) {
  const [overrides, setOverrides] = useState(null);
  return (
    <AlternatesContext.Provider value={{ overrides, setOverrides }}>
      {children}
    </AlternatesContext.Provider>
  );
}

export function useAlternatesValue() {
  return useContext(AlternatesContext).overrides;
}

// Las paginas de detalle llaman a este hook con sus slugs traducidos.
// Se limpia al desmontar para que las paginas estaticas usen el mapeo por ruta.
export function useSetAlternates(overrides) {
  const { setOverrides } = useContext(AlternatesContext);
  const es = overrides?.es;
  const en = overrides?.en;
  useEffect(() => {
    setOverrides(es && en ? { es, en } : null);
    return () => setOverrides(null);
  }, [es, en, setOverrides]);
}
