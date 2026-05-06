import ProductDetail from '../../components/marketing/ProductDetail';

// El componente compartido lee `useParams().slug` y resuelve el producto
// mirando los slugs ES o EN segun el idioma activo (useLang).
export default function ProductoDetalleEs() {
  return <ProductDetail />;
}
