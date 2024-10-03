import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css'; // Importa o CSS para o estilo da página

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState(''); // Novo estado para armazenar o nome do admin

  const [offers, setOffers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [messages, setMessages] = useState([]);

  const [newOffer, setNewOffer] = useState({ title: '', description: '', price: '', expiresAt: '' });
  const [newProcedure, setNewProcedure] = useState({ description: '', price: '' });
  const [newMessage, setNewMessage] = useState(''); // Novo estado para a nova mensagem

  const REFRESH_INTERVAL = 5000; // Definindo intervalo de 5 segundos

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha ambos os campos.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setAdminName(email === 'myshelrodrigues@gmail.com' ? 'Michael Rodrigues' : 
                     email === 'mirianvasconcelos83@gmail.com' ? 'Mirian Vasconcelos' : 'Administrador'); // Definindo o nome do admin
        toast.success('Login bem-sucedido!');
      } else {
        toast.error(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      toast.error('Erro ao tentar fazer login');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();

      // Autoatualização com setInterval
      const interval = setInterval(() => {
        fetchAllData();
      }, REFRESH_INTERVAL);

      // Limpeza do intervalo ao desmontar o componente
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const offersRes = await fetch('http://localhost:5000/api/public/offers', { headers });
      if (!offersRes.ok) throw new Error('Erro ao buscar ofertas');
      const offersData = await offersRes.json();
      setOffers(offersData);

      const proceduresRes = await fetch('http://localhost:5000/api/public/procedures', { headers });
      if (!proceduresRes.ok) throw new Error('Erro ao buscar procedimentos');
      const proceduresData = await proceduresRes.json();
      setProcedures(proceduresData);

      const messagesRes = await fetch('http://localhost:5000/api/admin/messages', { headers });
      if (!messagesRes.ok) throw new Error('Erro ao buscar mensagens');
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar dados');
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    };

    try {
      const response = await fetch('http://localhost:5000/api/admin/offer', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newOffer),
      });
      if (response.ok) {
        toast.success('Oferta adicionada com sucesso!');
        setNewOffer({ title: '', description: '', price: '', expiresAt: '' });
        fetchAllData(); // Refresh data
      } else {
        throw new Error('Erro ao adicionar oferta');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteOffer = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const response = await fetch(`http://localhost:5000/api/admin/offer/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
        // Atualiza a lista de ofertas após a exclusão
        setOffers(prevOffers => prevOffers.filter(offer => offer._id !== id));
        toast.success('Oferta excluída com sucesso!');
      } else {
        throw new Error('Erro ao excluir oferta');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddProcedure = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    };

    try {
      const response = await fetch('http://localhost:5000/api/admin/procedure', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newProcedure),
      });
      if (response.ok) {
        toast.success('Procedimento adicionado com sucesso!');
        setNewProcedure({ description: '', price: '' });
        fetchAllData(); // Refresh data
      } else {
        throw new Error('Erro ao adicionar procedimento');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProcedure = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const response = await fetch(`http://localhost:5000/api/admin/procedure/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
        // Atualiza a lista de procedimentos após a exclusão
        setProcedures(prevProcedures => prevProcedures.filter(proc => proc._id !== id));
        toast.success('Procedimento excluído com sucesso!');
      } else {
        throw new Error('Erro ao excluir procedimento');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApproveMessage = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const response = await fetch(`http://localhost:5000/api/admin/message/${id}/approve`, {
        method: 'PUT',
        headers: headers,
      });
      if (response.ok) {
        // Atualiza o estado local das mensagens
        setMessages(prevMessages =>
          prevMessages.map(msg => 
            msg._id === id ? { ...msg, approved: true } : msg
          )
        );
        toast.success('Mensagem aprovada com sucesso!');
      } else {
        throw new Error('Erro ao aprovar mensagem');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const response = await fetch(`http://localhost:5000/api/admin/message/${id}`, {
        method: 'DELETE',
        headers: headers,
      });
      if (response.ok) {
        toast.success('Mensagem excluída com sucesso!');
        fetchAllData(); // Chama a função para atualizar a lista de mensagens
      } else {
        throw new Error('Erro ao excluir mensagem');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/admin/message', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newMessage),
      });
      if (response.ok) {
        toast.success('Mensagem adicionada com sucesso!');
        setNewMessage({ name: '', stars: '', content: '' }); // Reseta o estado após a adição
        fetchAllData(); // Atualiza os dados
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao adicionar mensagem');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-panel">
      {!isAuthenticated ? (
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login de Administrador</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Entrar</button>
          </form>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Bem-vindo(a), {adminName}!</h2> {/* Mensagem de boas-vindas personalizada */}
          
          <h2>Ofertas</h2>
          <form onSubmit={handleAddOffer}>
            <input
              type="text"
              placeholder="Título da oferta"
              value={newOffer.title}
              onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descrição"
              value={newOffer.description}
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Preço"
              value={newOffer.price}
              onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Data de expiração"
              value={newOffer.expiresAt}
              onChange={(e) => setNewOffer({ ...newOffer, expiresAt: e.target.value })}
              required
            />
            <button type="submit">Adicionar Oferta</button>
          </form>
          <ul>
            {offers.map(offer => (
              <li key={offer._id}>
                {offer.title} - {offer.price}
                <button onClick={() => handleDeleteOffer(offer._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Procedimentos</h2>
          <form onSubmit={handleAddProcedure}>
            <input
              type="text"
              placeholder="Descrição do procedimento"
              value={newProcedure.description}
              onChange={(e) => setNewProcedure({ ...newProcedure, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Preço"
              value={newProcedure.price}
              onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })}
              required
            />
            <button type="submit">Adicionar Procedimento</button>
          </form>
          <ul>
            {procedures.map(proc => (
              <li key={proc._id}>
                {proc.description} - {proc.price}
                <button onClick={() => handleDeleteProcedure(proc._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Adicionar Mensagem</h2>
<form onSubmit={handleAddMessage}>
  <input
    type="text"
    placeholder="Seu Nome"
    value={newMessage.name}
    onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
    required
  />
  <input
    type="number"
    placeholder="Estrelas (1-5)"
    value={newMessage.stars}
    onChange={(e) => setNewMessage({ ...newMessage, stars: e.target.value })}
    required
  />
  <textarea
    placeholder="Conteúdo da Mensagem"
    value={newMessage.content}
    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
    required
  />
  <button type="submit">Adicionar Mensagem</button>
</form>

          <ul>
            {messages.map(msg => (
              <li key={msg._id}>
                <p>{msg.content}</p>
                <p>Status: {msg.approved ? 'Aprovada' : 'Pendente'}</p>
                <button 
                  onClick={() => handleApproveMessage(msg._id)} 
                  disabled={msg.approved}
                  style={{ backgroundColor: msg.approved ? 'green' : 'blue', color: 'white' }} // Mudando a cor do botão
                >
                  {msg.approved ? 'Aprovada' : 'Aprovar'}
                </button>
                <button onClick={() => handleDeleteMessage(msg._id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Admin;
