'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowUp, FaWhatsapp } from 'react-icons/fa';
import './header.css';

const Header = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    let scrollTimer = null;
    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      setShowScrollButton(false);
      scrollTimer = setTimeout(() => setShowScrollButton(true), 1500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <header className="site-header" id="top">
        <Image src="/images/logo.png" alt="Logo" className="logo" width={80} height={80} priority />
        <h1>Mirian Vasconcelos</h1>
        <p className="tagline">Design de cílios, sobrancelhas e depilação</p>
        <nav>
          <ul className="site-nav">
            <li><a href="#about">Sobre</a></li>
            <li><a href="#gallery">Galeria</a></li>
            <li><a href="#procedures">Procedimentos</a></li>
            <li><a href="#offers">Ofertas</a></li>
            <li><a href="#messages">Recados</a></li>
            <li><a href="#footer">Contato</a></li>
          </ul>
        </nav>
      </header>

      <section className="imagem" id="imag01">
        <div className="section-inner">
          <p className="box">
            Realce o seu olhar<br />
            com cuidado e carinho.<br />
            Cílios, sobrancelhas<br />
            e depilação em Guaxindiba.
          </p>
          <br />
          <a
            className="btn"
            href="https://wa.me/5521970259065"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp style={{ verticalAlign: '-2px', marginRight: 8 }} />
            Agendar horário
          </a>
        </div>
      </section>

      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Voltar ao topo">
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Header;
