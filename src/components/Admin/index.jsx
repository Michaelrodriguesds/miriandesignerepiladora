import React, { useState, useEffect } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css'; // Importa o CSS para o estilo da página

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  const [offers, setOffers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [messages, setMessages] = useState([]);

  const [newOffer, setNewOffer] = useState({ nome: '', descricao: '', valor: '', data_inicio: '', data_fim: '', imagem: '' });
  const [newProcedure, setNewProcedure] = useState({ name: '', metadata: '', price: '', imageUrl: '' });
  const [newMessage, setNewMessage] = useState({ name: '', content: '', stars: '' });

  const REFRESH_INTERVAL = 5000; // Definindo intervalo de 5 segundos

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha ambos os campos.');
      return;
    }
    try {
      const response = await fetch('https://backende-deploy.onrender.com/api/admin/login', {  // Alterado para o novo endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setAdminName(email === 'myshelrodrigues@gmail.com' ? 'Michael Rodrigues' : 
                     email === 'mirianvasconcelos83@gmail.com' ? 'Mirian Vasconcelos' : 'Administrador');
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

      const interval = setInterval(() => {
        fetchAllData();
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const offersRes = await fetch('https://backende-deploy.onrender.com/api/public/offers', { headers }); // Alterado para o novo endpoint
      if (!offersRes.ok) throw new Error('Erro ao buscar ofertas');
      const offersData = await offersRes.json();
      setOffers(offersData);

      const proceduresRes = await fetch('https://backende-deploy.onrender.com/api/public/procedures', { headers }); // Alterado para o novo endpoint
      if (!proceduresRes.ok) throw new Error('Erro ao buscar procedimentos');
      const proceduresData = await proceduresRes.json();
      setProcedures(proceduresData);

      const messagesRes = await fetch('https://backende-deploy.onrender.com/api/admin/messages', { headers }); // Alterado para o novo endpoint
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
      const response = await fetch('https://backende-deploy.onrender.com/api/admin/offer', { // Alterado para o novo endpoint
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newOffer),
      });
      if (response.ok) {
        toast.success('Oferta adicionada com sucesso!');
        setNewOffer({ nome: '', descricao: '', valor: '', data_inicio: '', data_fim: '', imagem: '' });
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
      const response = await fetch(`https://backende-deploy.onrender.com/api/admin/offer/${id}`, { // Alterado para o novo endpoint
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
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

    // Cria um novo objeto com os dados do procedimento
    const procedureData = { 
      name: newProcedure.name, 
      metadata: newProcedure.metadata, 
      price: newProcedure.price, 
      image: newProcedure.imageUrl || undefined // Agora usa 'image' corretamente
    };

    try {
      const response = await fetch('https://backende-deploy.onrender.com/api/admin/procedure', { // Alterado para o novo endpoint
        method: 'POST',
        headers: headers,
        body: JSON.stringify(procedureData), // Envia os dados do procedimento
      });
      if (response.ok) {
        toast.success('Procedimento adicionado com sucesso!');
        setNewProcedure({ name: '', metadata: '', price: '', imageUrl: '' }); // Reseta o estado
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
      const response = await fetch(`https://backende-deploy.onrender.com/api/admin/procedure/${id}`, { // Alterado para o novo endpoint
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
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
      const response = await fetch(`https://backende-deploy.onrender.com/api/admin/message/${id}/approve`, { // Alterado para o novo endpoint
        method: 'PUT',
        headers: headers,
      });
      if (response.ok) {
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
      const response = await fetch(`https://backende-deploy.onrender.com/api/admin/message/${id}`, { // Alterado para o novo endpoint
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
      const response = await fetch('https://backende-deploy.onrender.com/api/admin/message', { // Alterado para o novo endpoint
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newMessage),
      });
      if (response.ok) {
        toast.success('Mensagem enviada com sucesso!');
        setNewMessage({ name: '', content: '', stars: '' }); // Reseta o estado
        fetchAllData(); // Refresh data
      } else {
        throw new Error('Erro ao adicionar mensagem');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <h1>Login Admin</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div>
          <h1>Bem-vindo, {adminName}!</h1>

          <h2>Adicionar Oferta</h2>
          <form onSubmit={handleAddOffer}>
            <input type="text" placeholder="Nome" value={newOffer.nome} onChange={(e) => setNewOffer({ ...newOffer, nome: e.target.value })} required />
            <input type="text" placeholder="Descrição" value={newOffer.descricao} onChange={(e) => setNewOffer({ ...newOffer, descricao: e.target.value })} />
            <input type="number" placeholder="Valor" value={newOffer.valor} onChange={(e) => setNewOffer({ ...newOffer, valor: e.target.value })} />
            <input type="date" placeholder="Data de Início" value={newOffer.data_inicio} onChange={(e) => setNewOffer({ ...newOffer, data_inicio: e.target.value })} />
            <input type="date" placeholder="Data de Fim" value={newOffer.data_fim} onChange={(e) => setNewOffer({ ...newOffer, data_fim: e.target.value })} />
            <input type="text" placeholder="URL da Imagem" value={newOffer.imagem} onChange={(e) => setNewOffer({ ...newOffer, imagem: e.target.value })} />
            <button type="submit">Adicionar Oferta</button>
          </form>

          <h2>Ofertas</h2>
          <ul>
            {offers.map(offer => (
              <li key={offer._id}>
                <h3>{offer.nome} - {offer.valor}</h3>
                <p>{offer.descricao}</p>
                <p>Início: {new Date(offer.data_inicio).toLocaleDateString()} - Fim: {new Date(offer.data_fim).toLocaleDateString()}</p>
                <img src={offer.imagem} alt={offer.nome} width="100" />
                <button onClick={() => handleDeleteOffer(offer._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Adicionar Procedimento</h2>
          <form onSubmit={handleAddProcedure}>
            <input type="text" placeholder="Nome" value={newProcedure.name} onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })} />
            <input type="text" placeholder="Metadata" value={newProcedure.metadata} onChange={(e) => setNewProcedure({ ...newProcedure, metadata: e.target.value })} />
            <input type="text" placeholder="Preço" value={newProcedure.price} onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })} />
            <input type="text" placeholder="URL da Imagem" value={newProcedure.imageUrl} onChange={(e) => setNewProcedure({ ...newProcedure, imageUrl: e.target.value })} />
            <button type="submit">Adicionar Procedimento</button>
          </form>

          <h2>Procedimentos</h2>
          <ul>
            {procedures.map(proc => (
              <li key={proc._id}>
                <h3>{proc.name} - {proc.price}</h3>
                <button onClick={() => handleDeleteProcedure(proc._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Gerenciar Mensagens</h2>
          <form onSubmit={handleAddMessage}>
            <input type="text" placeholder="Nome" value={newMessage.name} onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })} />
            <input type="text" placeholder="Conteúdo" value={newMessage.content} onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })} />
            <input type="number" placeholder="Estrelas" value={newMessage.stars} onChange={(e) => setNewMessage({ ...newMessage, stars: e.target.value })} />
            <button type="submit">Enviar Mensagem</button>
          </form>

          <h2>Mensagens</h2>
          <ul>
            {messages.map(msg => (
              <li key={msg._id}>
                <p>{msg.name}: {msg.content} ({msg.stars} estrelas)</p>
                {!msg.approved && <button onClick={() => handleApproveMessage(msg._id)}>Aprovar</button>}
                <button onClick={() => handleDeleteMessage(msg._id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
