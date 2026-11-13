'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import '../About/About.css';
import './certificacao.css';

const CERTIFICADOS = [
  { src: '/images/certificadoCL.png', alt: 'Certificado CL' },
  { src: '/images/certificadoDP.png', alt: 'Certificado DP' },
  { src: '/images/certificadoSB.jpg', alt: 'Certificado SB' },
];

const Certificacao = () => {
  const [current, setCurrent] = useState(null);

  useBodyScrollLock(Boolean(current));

  return (
    <div className="certificados-bloco">
      <h3>Minhas certificações</h3>
      <div className="certificados">
        {CERTIFICADOS.map((cert) => (
          <Image
            key={cert.src}
            src={cert.src}
            alt={cert.alt}
            className="certificado-img"
            width={150}
            height={150}
            onClick={() => setCurrent(cert)}
          />
        ))}
      </div>

      {current && (
        <div className="overlay" onClick={() => setCurrent(null)}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="overlay-close" onClick={() => setCurrent(null)} aria-label="Fechar">
              &times;
            </button>
            <Image
              src={current.src}
              alt={current.alt}
              className="overlay-img"
              width={900}
              height={900}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificacao;
