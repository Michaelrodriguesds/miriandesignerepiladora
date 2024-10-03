import React, { useState, useEffect } from 'react';
import './gallery.css'; // Arquivo CSS para estilização

// Importando imagens da pasta assets
import cl1 from '../../assets/cl1.jpeg';
import cl2 from '../../assets/cl2.jpeg';
import cl3 from '../../assets/c3.jpeg';

const images = [cl1, cl2, cl3]; // Lista de imagens da galeria

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null); // Guarda a imagem selecionada

  const openImage = (imgSrc) => {
    setSelectedImage(imgSrc); // Exibe a imagem ao clicar
  };

  const closeImage = () => {
    setSelectedImage(null); // Fecha a visualização ao clicar fora
  };

  useEffect(() => {
    // Função para bloquear a rolagem da página
    const lockScroll = () => {
      document.body.style.overflow = 'hidden'; // Desativa a rolagem
    };

    // Função para desbloquear a rolagem da página
    const unlockScroll = () => {
      document.body.style.overflow = 'unset'; // Restaura a rolagem
    };

    if (selectedImage) {
      lockScroll(); // Bloqueia a rolagem quando uma imagem é selecionada
    } else {
      unlockScroll(); // Restaura a rolagem quando a imagem é fechada
    }

    // Limpeza ao desmontar o componente
    return () => {
      unlockScroll(); // Garante que a rolagem seja restaurada se o componente for desmontado
    };
  }, [selectedImage]); // Executa o efeito sempre que selectedImage mudar

  return (
    <div id="gallery" className="gallery-container">
      <h2>Galeria de Imagens</h2>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-item" onClick={() => openImage(img)}>
            <img src={img} alt={`Galeria ${index}`} className="gallery-img" />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeImage}>
          <img src={selectedImage} alt="Ampliada" className="lightbox-img" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
