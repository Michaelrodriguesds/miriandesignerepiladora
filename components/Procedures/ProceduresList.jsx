'use client';

import { useState, useRef } from 'react';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import './Procedures.css';

const DEFAULT_IMAGE = '/img_procedimentos/default.png';

const ProceduresList = ({ procedures, isDemo }) => {
  const [modalImage, setModalImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  useBodyScrollLock(Boolean(modalImage));

  const openModal = (image) => {
    setModalImage(image);
    setZoomLevel(1);
    setOffsetX(0);
    setOffsetY(0);
  };
  const closeModal = () => setModalImage(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;
    setOffsetX((prev) => prev + deltaX);
    setOffsetY((prev) => prev + deltaY);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => setIsDragging(false);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 1));

  return (
    <section id="procedures" className="normal">
      <div className="section-inner">
        <h2 className="titulo">Tabela de procedimentos</h2>
        <p className="procedures-sub">
          Valores atualizados pela Mirian. Toque na foto para ampliar.
        </p>
        {isDemo && (
          <p className="demo-notice">
            Exibindo conteúdo de exemplo — o backend não respondeu. Assim que voltar, os
            procedimentos reais aparecem aqui automaticamente.
          </p>
        )}

        <div className="procedures-menu">
          {procedures.map((procedure) => {
            const image = procedure.image || DEFAULT_IMAGE;
            return (
              <div key={procedure._id} className="procedure-row" onClick={() => openModal(image)}>
                <div className="procedure-thumb-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={procedure.name}
                    className="procedure-thumb"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
                <div className="procedure-info">
                  <h3>{procedure.name}</h3>
                  {procedure.metadata && <span>{procedure.metadata}</span>}
                </div>
                <span className="procedure-leader" />
                <span className="procedure-price">
                  R$ {Number(procedure.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {modalImage && (
        <div className="overlay" onClick={closeModal}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="overlay-close" onClick={closeModal} aria-label="Fechar">
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modalImage}
              alt="Procedimento"
              className="overlay-img"
              draggable={false}
              style={{
                transform: `scale(${zoomLevel}) translate(${offsetX / zoomLevel}px, ${offsetY / zoomLevel}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="overlay-actions">
              <button onClick={zoomOut} aria-label="Diminuir">-</button>
              <button onClick={zoomIn} aria-label="Aumentar">+</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProceduresList;
