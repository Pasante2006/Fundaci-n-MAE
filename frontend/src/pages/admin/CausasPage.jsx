import CatalogoPage from './CatalogoPage.jsx';

export default function CausasPage() {
  return (
    <CatalogoPage
      titulo="Causas impactadas"
      endpoint="/api/colaboradores"
      nombreNuevo="Nueva causa"
    />
  );
}
