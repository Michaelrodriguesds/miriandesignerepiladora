import React, { useEffect, useState, useRef } from 'react';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newStars, setNewStars] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [intervalTime, setIntervalTime] = useState(5000); // Tempo padrão de intervalo em milissegundos
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/public/messages');
        if (!response.ok) {
          throw new Error('Erro ao buscar mensagens');
        }
        const data = await response.json();
        setMessages(data.filter(message => message.approved));
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const updateTimer = () => {
        const messageContentLength = messages[currentMessageIndex].content.length;
        
        // Estima o tempo de leitura entre 3 e 10 segundos, mas permite mais se a mensagem for longa
        const estimatedReadingTime = Math.max(Math.min(messageContentLength * 100, 10000), 3000);
        
        // Limpa o intervalo anterior
        clearInterval(timerRef.current);

        // Atualiza o índice atual da mensagem após o tempo estimado
        timerRef.current = setInterval(() => {
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, estimatedReadingTime);
      };
      
      updateTimer(); // Chama a função para atualizar o timer

      return () => clearInterval(timerRef.current); // Limpa o intervalo ao desmontar
    }
  }, [messages, currentMessageIndex]);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/public/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, name: newName, stars: newStars }),
      });
      if (response.ok) {
        setNewMessage('');
        setNewName('');
        setNewStars(1);
        setFeedback('Mensagem recebida. Em breve estará disponível.');
      } else {
        setFeedback('Erro ao enviar mensagem.');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setFeedback('Erro ao enviar mensagem.');
    }
  };

  const handlePrevious = () => {
    setCurrentMessageIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const renderStars = (num, isAdding) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      const isSelected = i < num;
      stars.push(
        <span 
          key={i} 
          className={`star ${isSelected ? 'selected' : 'unselected'}`} 
          onClick={isAdding ? () => setNewStars(i + 1) : null} // Permite a seleção de estrelas somente na adição de mensagem
          role="button"
          aria-label={`${i + 1} estrela${i > 0 ? 's' : ''}`}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div id="messages" className="messages-container">
      <div className="carousel">
        <h2>Recados</h2>
        {messages.length > 0 ? (
          <div className="message">
            <div className="message-content">
              <h3>{messages[currentMessageIndex].name}</h3>
              <p>{messages[currentMessageIndex].content}</p>
              <p className="stars">{renderStars(messages[currentMessageIndex].stars, false)}</p>
            </div>
            <div className="carousel-controls">
              <button onClick={handlePrevious}>Anterior</button>
              <button onClick={handleNext}>Próximo</button>
            </div>
          </div>
        ) : (
          <p>Não há mensagens aprovadas para exibir.</p>
        )}
      </div>
      <form className="message-form" onSubmit={handleAddMessage}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Seu nome"
          required
        />
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui..."
          rows="4"
          required
        />
        <div className="star-rating">
          <p>Avalie sua mensagem:</p>
          {renderStars(newStars, true)} {/* Passando true para indicar que estamos adicionando */}
        </div>
        <button type="submit">Enviar Mensagem</button>
      </form>
     
      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default Messages;
