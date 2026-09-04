import CatalogoPage from './CatalogoPage.jsx';

export default function CausasPage() {
  return (
    <CatalogoPage
      titulo="Causas"
      endpoint="/api/causas"
      nombreNuevo="Nueva causa"
    />
  );
}
