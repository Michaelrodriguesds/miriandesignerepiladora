'use client';

import { useState } from 'react';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import './Offers.css';

const OffersList = ({ offers, isDemo }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  useBodyScrollLock(Boolean(selectedOffer));

  const closeModal = () => setSelectedOffer(null);
  const visibleOffers = offers.filter((offer) => offer.nome);

  return (
    <section id="offers" className="imagem">
      <div className="section-inner">
        <h2 className="titulo">Ofertas relâmpago</h2>
        <br />
        {isDemo && (
          <p className="demo-notice">
            Exibindo conteúdo de exemplo — o backend não respondeu. Assim que voltar, as ofertas
            reais aparecem aqui automaticamente.
          </p>
        )}

        {visibleOffers.length === 0 ? (
          <p className="box no-offer">Não há ofertas relâmpago disponíveis no momento.</p>
        ) : (
          <div className="flash-offer-list">
            {visibleOffers.map((offer) => (
              <div
                className="flash-offer-card"
                key={offer._id}
                onClick={() => offer.imagem && setSelectedOffer(offer)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={offer.imagem || '/img_procedimentos/default.png'}
                  alt={offer.nome}
                  className="flash-offer-image"
                />
                <div className="flash-offer-info">
                  <h3 className="flash-offer-subtitle">{offer.nome}</h3>
                  {offer.data_inicio && (
                    <p className="flash-offer-description">
                      Início: {new Date(offer.data_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  )}
                  {offer.data_fim && (
                    <p className="flash-offer-description">
                      Fim: {new Date(offer.data_fim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  )}
                  {offer.valor != null && offer.valor > 0 && (
                    <p className="flash-offer-price">
                      Apenas R$ {Number(offer.valor).toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOffer && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="overlay-close" onClick={closeModal} aria-label="Fechar">
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedOffer.imagem} alt={selectedOffer.nome} className="overlay-img" />
          </div>
        </div>
      )}
    </section>
  );
};

export default OffersList;
