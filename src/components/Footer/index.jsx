import React from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaWhatsapp, FaUserShield, FaMapMarkerAlt } from 'react-icons/fa'; // Ícones

const Footer = () => {
  return (
    <footer id="footer" className="footer-container">
      <div className="footer-info">
        <a href="/admin" className="admin-link">
          <FaUserShield size={14} /> Área Administrativa
        </a>
      </div>

      <div className="footer-contact">
        <p>
          <a href="https://wa.me/5521970259065" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp /> Fale Conosco (21) 97025-9065
          </a>
        </p>
        <p>
          <a href="https://www.instagram.com/mirianvasconcelosdesigner2/" target="_blank" rel="noopener noreferrer">
            <FaInstagram /> Instagram
          </a>
        </p>
        <p>
          <a href="https://maps.app.goo.gl/btAmESbmMwNHs4c28" target="_blank" rel="noopener noreferrer">
            <FaMapMarkerAlt /> Endereço: R. Aquilino de Carvalho, Lote 01 Qdra 77, Guaxindiba, Rua do CRÁS, Rua 4, após o viaduto da BR, CEP 24722-250
          </a>
        </p>
        <p>
          <a href="https://maps.app.goo.gl/Z8K17WtGBz8fpszHA" target="_blank" rel="noopener noreferrer">
            <FaMapMarkerAlt /> Endereço: Av. Prefeito Milton Rodrigues da Rocha, 46 - Manilha
          </a>
        </p>
      </div>

      <div className="footer-developer">
        <p>
          <a href="https://www.linkedin.com/in/michael-rodrigues-b741a1104/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> Desenvolvedor
          </a>
        </p>
      </div>

      <div className="footer-rights">
        <p>© 2024 Todos os direitos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
