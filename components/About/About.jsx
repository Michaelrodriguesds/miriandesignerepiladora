import './About.css';

// Componente sem interatividade: continua sendo Server Component.
// A faixa branca (<section className="normal">) é montada em app/page.jsx.
const About = () => {
  return (
    <div className="sobre">
      <h2 className="titulo">Sobre mim</h2>
      <p>
        Olá! Meu nome é Mirian Vasconcelos e sou especializada em realçar a beleza natural
        através do Design de Sobrancelhas, Extensão de Cílios e Epilação. Com técnicas
        personalizadas e produtos de alta qualidade, busco oferecer um atendimento cuidadoso e
        detalhista, sempre respeitando o estilo e as necessidades de cada cliente.
      </p>
      <p>
        Nos comprometemos com a excelência, proporcionando designs inovadores que refletem as
        necessidades únicas de cada cliente. Explore nossa galeria, veja nossos procedimentos e
        ofertas, e sinta-se à vontade para nos deixar um recado!
      </p>
    </div>
  );
};

export default About;
