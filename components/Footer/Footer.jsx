'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaWhatsapp, FaUserShield, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);

  // O botão do WhatsApp aparece quando a pessoa para de rolar (comportamento original)
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      setShowWhatsappButton(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowWhatsappButton(true), 1000);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <footer id="footer" className="site-footer">
      <p className="footer-title">Contato</p>

      <div className="footer-contact">
        <p>
          <a href="https://wa.me/5521970259065" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp /> Fale conosco: (21) 97025-9065
          </a>
        </p>
        <p>
          <a
            href="https://www.instagram.com/mirianvasconcelosdesigner2/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram /> Instagram
          </a>
        </p>
        <p>
          <a href="https://maps.app.goo.gl/btAmESbmMwNHs4c28" target="_blank" rel="noopener noreferrer">
            <FaMapMarkerAlt /> R. Aquilino de Carvalho, Lote 01 Qdra 77, Guaxindiba, Rua do CRÁS,
            Rua 4, após o viaduto da BR, CEP 24722-250
          </a>
        </p>
      </div>

      <p className="footer-small">
        Site criado por{' '}
        <a
          href="https://www.linkedin.com/in/michael-rodrigues-b741a1104/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin style={{ verticalAlign: '-2px' }} /> Michael Rodrigues
        </a>
      </p>
      <p className="footer-small">© 2024 Todos os direitos reservados</p>
      <p className="footer-small">
        <Link href="/admin" className="admin-link">
          <FaUserShield style={{ verticalAlign: '-2px' }} /> Área administrativa
        </Link>
      </p>

      {showWhatsappButton && (
        <a
          href="https://wa.me/5521970259065"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
          aria-label="Chamar no WhatsApp"
        >
          <FaWhatsapp />
        </a>
      )}
    </footer>
  );
};

export default Footer;
