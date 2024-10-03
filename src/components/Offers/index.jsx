import React, { useEffect, useState } from 'react';
import './Offers.css';
import { FaBolt, FaClock } from 'react-icons/fa'; // Importando ícones

const Offers = () => {
  const [offers, setOffers] = useState([]);

  // Função para buscar ofertas
  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/public/offers');
      if (!response.ok) {
        throw new Error('Erro ao buscar ofertas');
      }
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    }
  };

  // Função para calcular o tempo restante (sem exibir segundos)
  const calculateTimeLeft = (expiresAt) => {
    const now = new Date();
    const expirationDate = new Date(expiresAt);
    const timeLeft = expirationDate - now;

    if (timeLeft <= 0) {
      return 'Expirado';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    fetchOffers(); // Busca as ofertas ao carregar a página

    const interval = setInterval(() => {
      // Atualiza o tempo restante a cada minuto
      setOffers((prevOffers) =>
        prevOffers.map((offer) => ({
          ...offer,
          timeLeft: calculateTimeLeft(offer.expiresAt),
        }))
      );
    }, 60000); // Atualiza a cada minuto

    // Atualiza a página a cada 5 minutos
    const pageRefreshInterval = setInterval(() => {
      window.location.reload(); // Recarrega a página para buscar novas ofertas
    }, 300000); // 300000 ms = 5 minutos

    return () => {
      clearInterval(interval); // Limpa o intervalo de atualização
      clearInterval(pageRefreshInterval); // Limpa o intervalo de recarregamento da página
    };
  }, []);

  return (
    <div id="offers" className="offers-container">
      <h2 className="offers-title">Ofertas Relâmpago</h2>
      {offers.length > 0 ? (
        offers.map((offer) => {
          const timeLeft = calculateTimeLeft(offer.expiresAt);
          const isFlashSale = timeLeft !== 'Expirado' && (new Date(offer.expiresAt) - new Date()) < 60000; // Menos de 1 minuto
          return (
            <div
              key={offer._id}
              className={`offer-card ${isFlashSale ? 'flash-sale' : ''}`}
            >
              <div className="offer-info">
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-price">Valor: R$ {offer.price.toFixed(2)}</p>
              </div>
              <div className="offer-expiration-container">
                <FaClock className="clock-icon" />
                <p className={`offer-expiration ${isFlashSale ? 'flash-sale-time' : ''}`}>
                  Expira em: {timeLeft}
                </p>
                {isFlashSale && <FaBolt className="bolt-icon" />}
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-offers">Não há ofertas disponíveis.</p>
      )}
    </div>
  );
};

export default Offers;
