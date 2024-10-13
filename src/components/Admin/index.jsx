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
  const [newProcedure, setNewProcedure] = useState({ name: '', metadata: '', price: '', image: null });
  
  // Novos estados para a nova mensagem
  const [newMessage, setNewMessage] = useState({ name: '', content: '', stars: '' });

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
    const formData = new FormData();
    
    // Adiciona os campos ao FormData
    formData.append('name', newProcedure.name);
    formData.append('metadata', newProcedure.metadata);
    formData.append('price', newProcedure.price);
    formData.append('image', newProcedure.image); // Adiciona a imagem

    const headers = { 
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch('http://localhost:5000/api/admin/procedure', {
        method: 'POST',
        headers: headers,
        body: formData, // Envia o FormData
      });
      if (response.ok) {
        toast.success('Procedimento adicionado com sucesso!');
        setNewProcedure({ name: '', metadata: '', price: '', image: null });
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
                    msg._id === id ? { ...msg, approved: true } : msg // Marca a mensagem como aprovada
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
        body: JSON.stringify(newMessage), // Envia o objeto da nova mensagem
      });
      if (response.ok) {
        toast.success('Mensagem enviada com sucesso!');
        setNewMessage({ name: '', content: '', stars: '' }); // Reseta os campos da nova mensagem
        fetchAllData(); // Atualiza a lista de mensagens
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      {!isAuthenticated ? (
        <div className="login-form">
          <h2>Login do Administrador</h2>
          <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
            <button type="submit">Entrar</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Bem-vindo, {adminName}</h2>
          <h3>Adicionar Nova Oferta</h3>
          <form onSubmit={handleAddOffer}>
            <input type="text" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} placeholder="Título" required />
            <input type="text" value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} placeholder="Descrição" required />
            <input type="number" value={newOffer.price} onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })} placeholder="Preço" required />
            <input type="date" value={newOffer.expiresAt} onChange={(e) => setNewOffer({ ...newOffer, expiresAt: e.target.value })} required />
            <button type="submit">Adicionar Oferta</button>
          </form>
          <h3>Ofertas</h3>
          <ul>
            {offers.map(offer => (
              <li key={offer._id}>
                {offer.title} - {offer.description} - R$ {offer.price}
                <button onClick={() => handleDeleteOffer(offer._id)}>Excluir</button>
              </li>
            ))}
          </ul>
          
          <h3>Adicionar Novo Procedimento</h3>
          <form onSubmit={handleAddProcedure}>
            <input type="text" value={newProcedure.name} onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })} placeholder="Nome" required />
            <input type="text" value={newProcedure.metadata} onChange={(e) => setNewProcedure({ ...newProcedure, metadata: e.target.value })} placeholder="Meta" required />
            <input type="number" value={newProcedure.price} onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })} placeholder="Preço" required />
            <input type="file" onChange={(e) => setNewProcedure({ ...newProcedure, image: e.target.files[0] })} required />
            <button type="submit">Adicionar Procedimento</button>
          </form>
          <h3>Procedimentos</h3>
          <ul>
            {procedures.map(proc => (
              <li key={proc._id}>
                {proc.name} - {proc.metadata} - R$ {proc.price}
                <button onClick={() => handleDeleteProcedure(proc._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h3>Mensagens</h3>
<ul>
  {messages.map(msg => (
    <li key={msg._id}>
      {msg.name}: {msg.content} (Avaliação: {msg.stars})
      <button 
        className={msg.approved ? 'button-approved' : ''} // Adiciona a classe se a mensagem estiver aprovada
        onClick={() => handleApproveMessage(msg._id)}
        disabled={msg.approved} // Desabilita o botão se já estiver aprovado
      >
        {msg.approved ? 'Aprovada' : 'Aprovar'} {/* Muda o texto baseado no estado de aprovação */}
      </button>
      <button onClick={() => handleDeleteMessage(msg._id)}>Excluir</button>
    </li>
  ))}
</ul>

<h3>Enviar Mensagem</h3>
<form onSubmit={handleAddMessage}>
  <input 
    type="text" 
    value={newMessage.name} 
    onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })} 
    placeholder="Seu Nome" 
    required 
  />
  <textarea 
    value={newMessage.content} 
    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })} 
    placeholder="Conteúdo" 
    required
  ></textarea>
  <input 
    type="number" 
    value={newMessage.stars} 
    onChange={(e) => setNewMessage({ ...newMessage, stars: e.target.value })} 
    placeholder="Estrelas" 
    required 
  />
  <button type="submit">Enviar Mensagem</button>
</form>

        </div>
      )}
    </div>
  );
};

export default Admin;
