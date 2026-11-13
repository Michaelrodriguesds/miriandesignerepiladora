'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import './gallery.css';

const images = ['/images/cl1.jpeg', '/images/cl2.jpeg', '/images/cl3.jpeg'];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useBodyScrollLock(Boolean(selectedImage));

  return (
    <section id="gallery" className="imagem">
      <div className="section-inner">
        <h2 className="titulo">Galeria de imagens</h2>
        <br />
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div key={img} className="gallery-item" onClick={() => setSelectedImage(img)}>
              <Image
                src={img}
                alt={`Trabalho ${index + 1}`}
                className="gallery-img"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="overlay-close" onClick={() => setSelectedImage(null)} aria-label="Fechar">
              &times;
            </button>
            <Image
              src={selectedImage}
              alt="Imagem ampliada"
              className="overlay-img"
              width={1200}
              height={1200}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
