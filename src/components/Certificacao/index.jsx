import React, { useState, useEffect } from "react";
import "./certificacao.css"; 
import certCL from "../../assets/certificadoCL.png";  
import certDP from "../../assets/certificadoDP.png";
import certSB from "../../assets/certificadoSB.jpg";

const Certificacao = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCertImage, setCurrentCertImage] = useState("");

  const openModal = (image) => {
    setCurrentCertImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCertImage("");
  };

  // UseEffect para bloquear/desbloquear rolagem da página
  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = modalOpen ? "hidden" : "auto"; // Bloqueia a rolagem quando o modal está aberto
    };

    disableScroll(); // Chama a função ao renderizar

    // Adiciona um listener para garantir que a rolagem seja desabilitada ao abrir o modal
    window.addEventListener("scroll", disableScroll);
    
    // Limpa o listener ao desmontar
    return () => {
      window.removeEventListener("scroll", disableScroll);
      document.body.style.overflow = "auto"; // Restaura a rolagem ao desmontar
    };
  }, [modalOpen]); // Executa sempre que modalOpen mudar

  return (
    <div className="certificado-section">
      <h3 className="certificado-title">Nossas Certificações</h3>
      <div className="certificados">
        <img
          src={certCL}
          alt="Certificado CL"
          className="certificado-img"
          onClick={() => openModal(certCL)}
        />
        <img
          src={certDP}
          alt="Certificado DP"
          className="certificado-img"
          onClick={() => openModal(certDP)}
        />
        <img
          src={certSB}
          alt="Certificado SB"
          className="certificado-img"
          onClick={() => openModal(certSB)}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={currentCertImage} alt="Certificado" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificacao;
