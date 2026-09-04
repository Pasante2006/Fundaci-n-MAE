import CatalogoPage from './CatalogoPage.jsx';

export default function ColaboradoresPage() {
  return (
    <CatalogoPage
      titulo="Colaboradores impactados"
      endpoint="/api/colaboradores"
      nombreNuevo="Nuevo colaborador"
    />
  );
}
