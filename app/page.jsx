import Header from '@/components/Header/Header';
import About from '@/components/About/About';
import Certificacao from '@/components/Certificacao/Certificacao';
import Gallery from '@/components/Gallery/Gallery';
import Procedures from '@/components/Procedures/Procedures';
import Offers from '@/components/Offers/Offers';
import Messages from '@/components/Messages/Messages';
import Footer from '@/components/Footer/Footer';

// Ordem das faixas, alternando como no cordel:
// cabeçalho preto → foto → branco → foto → branco → foto → branco → rodapé preto
export default function HomePage() {
  return (
    <div className="App">
      <Header /> {/* cabeçalho preto + faixa de foto (apresentação) */}
      <section id="about" className="normal">
        <div className="section-inner">
          <About />
          <Certificacao />
        </div>
      </section>
      <Gallery /> {/* faixa de foto */}
      <Procedures /> {/* faixa branca — dados do backend */}
      <Offers /> {/* faixa de foto — dados do backend */}
      <Messages /> {/* faixa branca — dados do backend */}
      <Footer />
    </div>
  );
}
