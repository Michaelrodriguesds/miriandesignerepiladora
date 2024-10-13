import React, { useState, useEffect } from 'react'; 
import './header.css'; // O CSS global deve incluir os estilos para os botões
import logo from '../../assets/logo.png'; 
import { FaArrowUp, FaWhatsapp } from 'react-icons/fa'; // Ícones

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Fecha o menu após clicar
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar ou esconder os botões dependendo da posição de rolagem
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        {/* Ao clicar no logo ou título, rolar para o topo */}
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => handleScrollToSection('top')}
        />
        <h1 className="title" onClick={() => handleScrollToSection('top')}>
          Last Designer
        </h1>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li><a onClick={() => handleScrollToSection('about')}>Sobre</a></li>
            <li><a onClick={() => handleScrollToSection('gallery')}>Galeria</a></li>
            <li><a onClick={() => handleScrollToSection('procedures')}>Procedimentos</a></li>
            <li><a onClick={() => handleScrollToSection('offers')}>Ofertas</a></li>
            <li><a onClick={() => handleScrollToSection('messages')}>Recados</a></li>
            <li><a onClick={() => handleScrollToSection('footer')}>Contato</a></li> 
          </ul>
        </nav>
        <button className="menu-toggle" onClick={handleMenuToggle}>
          ☰
        </button>
      </div>

      {/* Botão de scroll para o topo, exibido apenas se showScrollButton for true */}
      {showScrollButton && (
        <button className="scroll-to-top show" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}

      {/* Botão do WhatsApp, exibido apenas se showScrollButton for true */}
      {showScrollButton && (
        <button className="whatsapp-button show" onClick={() => window.open('https://wa.me/5521970259065', '_blank')}>
          <FaWhatsapp />
        </button>
      )}
    </header>
  );
};

export default Header;
