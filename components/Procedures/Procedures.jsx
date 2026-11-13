import { API_URL } from '@/lib/api';
import { DEMO_PROCEDURES } from '@/lib/demoData';
import ProceduresList from './ProceduresList';

// Busca no servidor (Server Component) e repassa para a lista interativa.
// Se o backend não responder, mostra conteúdo de exemplo com um aviso.
async function getProcedures() {
  try {
    const res = await fetch(`${API_URL}/api/public/procedures`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Erro ao buscar dados do servidor');
    const data = await res.json();
    return { procedures: data, isDemo: false };
  } catch (error) {
    console.error('Erro ao buscar procedimentos (mostrando exemplo):', error);
    return { procedures: DEMO_PROCEDURES, isDemo: true };
  }
}

const Procedures = async () => {
  const { procedures, isDemo } = await getProcedures();
  return <ProceduresList procedures={procedures} isDemo={isDemo} />;
};

export default Procedures;
