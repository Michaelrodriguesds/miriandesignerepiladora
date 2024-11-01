import React, { useEffect, useState } from 'react';
import './Offers.css'; // Importa o CSS para estilos
import { FaBolt } from 'react-icons/fa'; // Importando ícone de relâmpago

const FlashOffer = () => {
  const [offers, setOffers] = useState([]); // Altera para um array de ofertas
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null); // Para a oferta selecionada no modal

  // Função para buscar as ofertas
  const fetchFlashOffer = async () => {
    try {
      const response = await fetch('https://backende-deploy.onrender.com/api/public/offers'); // URL do endpoint
      if (!response.ok) {
        throw new Error('Erro ao buscar as ofertas relâmpago');
      }
      const data = await response.json();
      console.log(data); // Para verificar a estrutura do dado
      setOffers(data); // Armazena todas as ofertas
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashOffer(); // Busca as ofertas ao carregar a página
  }, []);

  // Função para abrir o modal com a oferta selecionada
  const openModal = (offer) => {
    setSelectedOffer(offer);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setSelectedOffer(null);
  };

  if (loading) return <div className="loading">Carregando...</div>;

  if (offers.length === 0) return <div className="no-offer">Não há ofertas relâmpago disponíveis.</div>;

  return (
    <div id="offers" className="flash-offer-container">
      <h2 className="flash-offer-title">
        ⚡ Ofertas Relâmpago: Não Perca Essa Chance! ⚡
      </h2>
      <div className="flash-offer-list">
        {offers.map(offer => (
          offer.nome && ( // Verifica se o nome da oferta está presente
            <div className="flash-offer-card" key={offer._id} onClick={() => openModal(offer)}>
              <img
                src={offer.imagem || '/img_ofertas/default.png'} 
                alt={offer.nome}
                className="flash-offer-image animated-image"
              />
              <div className="flash-offer-info">
                <h3 className="flash-offer-subtitle">{offer.nome}</h3>
                
                {/* Renderiza a data de início apenas se existir */}
                {offer.data_inicio && (
                  <p className="flash-offer-description">
                    Início: {new Date(offer.data_inicio).toLocaleDateString()}
                  </p>
                )}

                {/* Renderiza a data de fim apenas se existir */}
                {offer.data_fim && (
                  <p className="flash-offer-description">
                    Fim: {new Date(offer.data_fim).toLocaleDateString()}
                  </p>
                )}

                {/* Renderiza o valor apenas se existir e for maior que zero */}
                {offer.valor != null && offer.valor > 0 && (
                  <p className="flash-offer-price">Apenas R$ {offer.valor.toFixed(2)}</p>
                )}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Modal para exibir a imagem em tela cheia */}
      {selectedOffer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedOffer.imagem} alt={selectedOffer.nome} className="modal-image" />
            <button className="modal-close-button" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
      
      <div className="flash-offer-bolt">
        <FaBolt className="bolt-icon" />
      </div>
    </div>
  );
};

export default FlashOffer;
