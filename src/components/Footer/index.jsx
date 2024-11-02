// Importa o React e as bibliotecas necessárias
import React, { useState, useEffect } from 'react';
import './Footer.css'; // Importa o arquivo de estilos para o componente Footer
import { FaInstagram, FaLinkedin, FaWhatsapp, FaUserShield, FaMapMarkerAlt } from 'react-icons/fa'; // Ícones de redes sociais e outras funções

const Footer = () => {
  // Estado para controlar a visibilidade do botão de WhatsApp
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);

  // useEffect para monitorar o scroll da página e definir a visibilidade do botão de WhatsApp
  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      // Esconde o botão quando a página está sendo rolada
      setShowWhatsappButton(false);
      // Define um atraso para exibir o botão novamente após o scroll parar
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowWhatsappButton(true); // Exibe o botão após uma pausa no scroll
      }, 1000);
    };

    // Adiciona o ouvinte de evento para o scroll
    window.addEventListener('scroll', handleScroll);

    // Limpeza: remove o ouvinte de evento ao desmontar o componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <footer id="footer" className="footer-container">
      {/* Link para a área administrativa com ícone de escudo */}
      <div className="footer-info">
        <a href="/admin" className="admin-link">
          <FaUserShield size={14} /> Área Administrativa
        </a>
      </div>

      {/* Informações de contato e links para redes sociais */}
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

      {/* Link para o perfil do desenvolvedor no LinkedIn */}
      <div className="footer-developer">
        <p>
          <a href="https://www.linkedin.com/in/michael-rodrigues-b741a1104/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> Desenvolvedor
          </a>
        </p>
      </div>

      {/* Direitos autorais */}
      <div className="footer-rights">
        <p>© 2024 Todos os direitos reservados</p>
      </div>

      {/* Botão de WhatsApp com visibilidade condicional */}
      {showWhatsappButton && (
        <a
          href="https://wa.me/5521970259065"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-button"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#25D366',
            color: 'white',
            borderRadius: '50%',
            padding: '15px',
            fontSize: '24px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          <FaWhatsapp />
        </a>
      )}
    </footer>
  );
};

export default Footer;
