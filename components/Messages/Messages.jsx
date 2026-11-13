'use client';

import { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage } from '@/lib/api';
import { DEMO_MESSAGES } from '@/lib/demoData';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [feedback, setFeedback] = useState('');
  const timerRef = useRef(null);

  // Recados aprovados vêm do backend (rota pública)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data.filter((message) => message.approved));
      } catch (error) {
        console.error('Erro ao buscar mensagens (mostrando exemplo):', error);
        setMessages(DEMO_MESSAGES);
        setIsDemo(true);
      }
    };
    fetchMessages();
  }, []);

  // Troca automática de recado (tempo proporcional ao tamanho do texto)
  useEffect(() => {
    if (messages.length > 1) {
      const current = messages[currentMessageIndex % messages.length];
      const readingTime = Math.max(Math.min(current.content.length * 100, 10000), 4000);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, readingTime);
      return () => clearInterval(timerRef.current);
    }
    return undefined;
  }, [messages, currentMessageIndex]);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({ content: newMessage, name: newName, stars: newStars });
      setNewMessage('');
      setNewName('');
      setNewStars(5);
      setFeedback('Mensagem recebida. Em breve estará disponível.');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setFeedback('Erro ao enviar mensagem. Tente novamente mais tarde.');
    }
  };

  const handlePrevious = () =>
    setCurrentMessageIndex((prev) => (prev - 1 + messages.length) % messages.length);
  const handleNext = () => setCurrentMessageIndex((prev) => (prev + 1) % messages.length);

  const current = messages.length > 0 ? messages[currentMessageIndex % messages.length] : null;

  return (
    <section id="messages" className="normal">
      <div className="section-inner messages-grid">
        <div className="carousel">
          <h2 className="titulo">Recados</h2>
          {isDemo && (
            <p className="demo-notice">
              Exibindo conteúdo de exemplo — o backend não respondeu. Assim que voltar, os recados
              reais aparecem aqui automaticamente.
            </p>
          )}

          {current ? (
            <div className="message">
              <p className="message-text">{current.content}</p>
              <p className="message-author">
                — {current.name}{' '}
                <span className="stars" aria-label={`${current.stars} estrelas`}>
                  {'⭐'.repeat(Math.max(0, Math.min(5, Number(current.stars) || 0)))}
                </span>
              </p>
              {messages.length > 1 && (
                <div className="carousel-controls">
                  <button type="button" onClick={handlePrevious}>Anterior</button>
                  <button type="button" onClick={handleNext}>Próximo</button>
                </div>
              )}
            </div>
          ) : (
            <p className="message-empty">Ainda não há recados aprovados para exibir.</p>
          )}
        </div>

        <form className="message-form" onSubmit={handleAddMessage}>
          <h3>Deixe o seu recado</h3>
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
            <span>Sua avaliação:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star ${n <= newStars ? 'selected' : 'unselected'}`}
                onClick={() => setNewStars(n)}
                aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
              >
                ⭐
              </button>
            ))}
          </div>
          <button type="submit" className="btn-send">Enviar mensagem</button>
          {feedback && <div className="feedback">{feedback}</div>}
        </form>
      </div>
    </section>
  );
};

export default Messages;
