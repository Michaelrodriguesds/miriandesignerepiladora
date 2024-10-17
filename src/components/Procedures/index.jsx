import React, { useEffect, useState, useRef } from 'react';
import './Procedures.css'; // Importando o CSS

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [modalImage, setModalImage] = useState(null); // Estado para armazenar a imagem selecionada
  const [zoomLevel, setZoomLevel] = useState(1); // Controle de zoom
  const [offsetX, setOffsetX] = useState(0); // Controle da posição horizontal
  const [offsetY, setOffsetY] = useState(0); // Controle da posição vertical
  const [isDragging, setIsDragging] = useState(false); // Controle de arraste
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro
  const modalImageRef = useRef(null); // Referência para a imagem no modal
  const lastMousePosition = useRef({ x: 0, y: 0 }); // Armazena a posição anterior do mouse

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/public/procedures');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }
        const data = await response.json();
        setProcedures(data);
        setIsLoading(false); // Define o estado de carregamento como falso após os dados serem carregados
      } catch (error) {
        setError(error.message);
        setIsLoading(false); // Mesmo em caso de erro, precisamos parar o estado de carregamento
      }
    };

    fetchProcedures();
  }, []);

  const openModal = (image) => {
    setModalImage(image);
    setZoomLevel(1); // Resetar o zoom ao abrir o modal
    setOffsetX(0); // Resetar posição horizontal
    setOffsetY(0); // Resetar posição vertical
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const zoomIn = (e) => {
    e.stopPropagation(); // Evitar fechar o modal ao clicar no botão
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Aumentar o zoom até 3x
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1)); // Diminuir o zoom até 1x
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY }; // Armazenar a posição inicial do mouse
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;

    // Atualizar a posição da imagem
    setOffsetX((prevOffsetX) => prevOffsetX + deltaX);
    setOffsetY((prevOffsetY) => prevOffsetY + deltaY);

    lastMousePosition.current = { x: e.clientX, y: e.clientY }; // Atualizar a posição do mouse
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Parar o arraste
  };

  const handleMouseLeave = () => {
    setIsDragging(false); // Garantir que o arraste pare ao sair da área da imagem
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Exibe "Carregando" enquanto os dados são buscados
  }

  if (error) {
    return <div>Erro: {error}</div>; // Exibe uma mensagem de erro caso haja falha no carregamento
  }

  return (
    <div id="procedures" className="procedures-container">
      <h2>Tabela de Preços</h2>
      <table className="procedures-table">
        <thead>
          <tr>
            <th>Nome do Procedimento</th>
            <th>Método</th>
            <th>Preço</th>
            <th>Imagem</th>
          </tr>
        </thead>
        <tbody>
          {procedures.map((procedure) => (
            <tr key={procedure._id}>
              <td>{procedure.name}</td>
              <td className="center-text">{procedure.metadata}</td>
              <td>R$ {procedure.price.toFixed(2)}</td>
              <td>
                <img 
                  src={procedure.image ? procedure.image : '/img_procedimentos/default.png'} // Verifica se a imagem existe, caso contrário usa a imagem padrão
                  alt={procedure.name} 
                  className="procedure-image"
                  onError={(e) => {
                    e.target.onerror = null; // Evitar loop infinito
                    e.target.src = '/img_procedimentos/default.png'; // Usar a imagem padrão em caso de erro
                  }}
                  onClick={() => openModal(procedure.image ? procedure.image : '/img_procedimentos/default.png')} // Abre o modal com a URL da imagem ou a imagem padrão
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para exibir a imagem em tela cheia */}
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Evitar fechar o modal ao clicar na área interna
          >
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <img
              ref={modalImageRef}
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
              onMouseLeave={handleMouseLeave}
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
