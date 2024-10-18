import React from "react";
import "./about.css"; 

const Sobre = () => {
  return (
    <div id="about" className="sobre-section">
      <div className="sobre-content">
        <div className="sobre-text">
          <h2>Sobre Nós</h2>
          <p>
            Bem-vindo à Mirian Designer! Aqui somos profissionais que 
            se especializaram em design criativo, buscamos sempre oferecer as melhores 
            soluções para nossos clientes. Nossos inúmeros 
            atendimentos bem-sucedidos nos deram uma posição de destaque no mercado.
          </p>
          <p>
            Nos comprometemos com a excelência, proporcionando designs inovadores que 
            refletem as necessidades únicas de cada cliente. Explore nossa galeria, 
            veja nossos procedimentos e ofertas, e sinta-se à vontade para nos deixar 
            um recado!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
