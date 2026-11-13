import Admin from '@/components/Admin/Admin';

// A pasta app/admin/ com um page.jsx dentro já cria automaticamente a rota
// "/admin" — é o que no React Router seria <Route path="/admin" element={<Admin />} />.
export const metadata = {
  title: 'Área Administrativa | Mirian Vasconcelos',
  robots: { index: false, follow: false }, // melhoria: impede o Google de indexar o /admin
};

export default function AdminPage() {
  return <Admin />;
}
