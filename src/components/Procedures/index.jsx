import React, { useEffect, useState, useRef } from 'react';
import './Procedures.css';

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await fetch('https://backende-deploy.onrender.com/api/public/procedures');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }
        const data = await response.json();
        setProcedures(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProcedures();
  }, []);

  const openModal = (image) => {
    setModalImage(image);
    setZoomLevel(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;
    setOffsetX((prevOffsetX) => prevOffsetX + deltaX);
    setOffsetY((prevOffsetY) => prevOffsetY + deltaY);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const zoomIn = () => setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3));
  const zoomOut = () => setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1));

  if (error) return <div>Erro: {error}</div>;

  return (
    <div id="procedures" className="procedures-container">
      <h2>Tabela de Procedimentos</h2>
      <div className="procedures-grid">
        {procedures.map((procedure) => (
          <div key={procedure._id} className="procedure-card">
            <img 
              src={procedure.image || '/img_procedimentos/default.png'}
              alt={procedure.name}
              className="procedure-image"
              onClick={() => openModal(procedure.image || '/img_procedimentos/default.png')}
              onError={(e) => { e.target.onerror = null; e.target.src = '/img_procedimentos/default.png'; }}
            />
            <div className="procedure-details">
              <h3>{procedure.name}</h3>
              <p>Método: {procedure.metadata}</p>
              <p>Preço: R$ {procedure.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeModal}>&times;</button>
            <img
              src={modalImage}
              alt="Procedimento"
              className="modal-image"
              style={{
                transform: `scale(${zoomLevel}) translate(${offsetX / zoomLevel}px, ${offsetY / zoomLevel}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="zoom-controls">
              <button onClick={zoomOut}>-</button>
              <button onClick={zoomIn}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procedures;
