import { API_URL } from '@/lib/api';
import { DEMO_OFFERS } from '@/lib/demoData';
import OffersList from './OffersList';

async function getOffers() {
  try {
    const res = await fetch(`${API_URL}/api/public/offers`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Erro ao buscar as ofertas relâmpago');
    const data = await res.json();
    return { offers: data, isDemo: false };
  } catch (error) {
    console.error('Erro ao buscar ofertas (mostrando exemplo):', error);
    return { offers: DEMO_OFFERS, isDemo: true };
  }
}

const Offers = async () => {
  const { offers, isDemo } = await getOffers();
  return <OffersList offers={offers} isDemo={isDemo} />;
};

export default Offers;
