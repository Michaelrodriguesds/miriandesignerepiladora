import React, { useState, useEffect } from 'react'; 
import './header.css';
import logo from '../../assets/logo.png'; // Substitua pelo caminho correto da sua imagem
import { FaArrowUp } from 'react-icons/fa'; // Ícone de seta para cima

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  let scrollTimer = null;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para rolar suavemente para a seção desejada
  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Fecha o menu após clicar
    }
  };

  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Monitora o scroll para exibir ou ocultar o botão
  const handleScroll = () => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    setShowScrollButton(false); // Esconde o botão enquanto o usuário está rolando

    scrollTimer = setTimeout(() => {
      setShowScrollButton(true); // Mostra o botão após parar de rolar
    }, 1500); // Mostra o botão após 1.5 segundos de inatividade
  };

  useEffect(() => {
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
            <li><a onClick={() => handleScrollToSection('footer')}>Contato</a></li> {/* Contato rola para o footer */}
          </ul>
        </nav>
        <button className="menu-toggle" onClick={handleMenuToggle}>
          ☰
        </button>
      </div>

      {/* Botão de scroll para o topo */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </header>
  );
};

export default Header;