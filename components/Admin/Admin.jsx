'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  adminLogin,
  getOffers,
  getProcedures,
  getAdminMessages,
  addOffer,
  deleteOffer,
  addProcedure,
  deleteProcedure,
  addMessage,
  approveMessage,
  deleteMessage,
} from '@/lib/api';
import './Admin.css';

const REFRESH_INTERVAL = 5000;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  const [offers, setOffers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [messages, setMessages] = useState([]);

  const [newOffer, setNewOffer] = useState({
    nome: '',
    descricao: '',
    valor: '',
    data_inicio: '',
    data_fim: '',
    imagem: '',
  });
  const [newProcedure, setNewProcedure] = useState({
    name: '',
    metadata: '',
    price: '',
    imageUrl: '',
  });
  const [newMessage, setNewMessage] = useState({ name: '', content: '', stars: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha ambos os campos.');
      return;
    }
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setAdminName(
        email === 'myshelrodrigues@gmail.com'
          ? 'Michael Rodrigues'
          : email === 'mirianvasconcelos83@gmail.com'
          ? 'Mirian Vasconcelos'
          : 'Administrador'
      );
      toast.success('Login bem-sucedido!');
    } catch (error) {
      toast.error(error.message || 'Credenciais inválidas');
    }
  };

  const fetchAllData = async () => {
    try {
      const [offersData, proceduresData, messagesData] = await Promise.all([
        getOffers({ auth: true }),
        getProcedures({ auth: true }),
        getAdminMessages(),
      ]);
      setOffers(offersData);
      setProcedures(proceduresData);
      setMessages(messagesData);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar dados');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const interval = setInterval(fetchAllData, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await addOffer(newOffer);
      toast.success('Oferta adicionada com sucesso!');
      setNewOffer({ nome: '', descricao: '', valor: '', data_inicio: '', data_fim: '', imagem: '' });
      fetchAllData();
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar oferta');
    }
  };

  const handleDeleteOffer = async (id) => {
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
      toast.success('Oferta excluída com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir oferta');
    }
  };

  const handleAddProcedure = async (e) => {
    e.preventDefault();
    const procedureData = {
      name: newProcedure.name,
      metadata: newProcedure.metadata,
      price: newProcedure.price,
      image: newProcedure.imageUrl || undefined,
    };

    try {
      await addProcedure(procedureData);
      toast.success('Procedimento adicionado com sucesso!');
      setNewProcedure({ name: '', metadata: '', price: '', imageUrl: '' });
      fetchAllData();
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar procedimento');
    }
  };

  const handleDeleteProcedure = async (id) => {
    try {
      await deleteProcedure(id);
      setProcedures((prev) => prev.filter((proc) => proc._id !== id));
      toast.success('Procedimento excluído com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir procedimento');
    }
  };

  const handleApproveMessage = async (id) => {
    try {
      await approveMessage(id);
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, approved: true } : msg)));
      toast.success('Mensagem aprovada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao aprovar mensagem');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Mensagem excluída com sucesso!');
      fetchAllData();
    } catch (error) {
      toast.error(error.message || 'Erro ao excluir mensagem');
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      await addMessage(newMessage);
      toast.success('Mensagem enviada com sucesso!');
      setNewMessage({ name: '', content: '', stars: '' });
      fetchAllData();
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar mensagem');
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <h1>Login Admin</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div>
          <h1>Bem-vindo, {adminName}!</h1>

          <h2>Adicionar Oferta</h2>
          <form onSubmit={handleAddOffer}>
            <input
              type="text"
              placeholder="Nome"
              value={newOffer.nome}
              onChange={(e) => setNewOffer({ ...newOffer, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Descrição"
              value={newOffer.descricao}
              onChange={(e) => setNewOffer({ ...newOffer, descricao: e.target.value })}
            />
            <input
              type="number"
              placeholder="Valor"
              value={newOffer.valor}
              onChange={(e) => setNewOffer({ ...newOffer, valor: e.target.value })}
            />
            <input
              type="date"
              placeholder="Data de Início"
              value={newOffer.data_inicio}
              onChange={(e) => setNewOffer({ ...newOffer, data_inicio: e.target.value })}
            />
            <input
              type="date"
              placeholder="Data de Fim"
              value={newOffer.data_fim}
              onChange={(e) => setNewOffer({ ...newOffer, data_fim: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={newOffer.imagem}
              onChange={(e) => setNewOffer({ ...newOffer, imagem: e.target.value })}
            />
            <button type="submit">Adicionar Oferta</button>
          </form>

          <h2>Ofertas</h2>
          <ul>
            {offers.map((offer) => (
              <li key={offer._id}>
                <h3>
                  {offer.nome} - {offer.valor}
                </h3>
                <p>{offer.descricao}</p>
                <p>
                  Início: {new Date(offer.data_inicio).toLocaleDateString()} - Fim:{' '}
                  {new Date(offer.data_fim).toLocaleDateString()}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={offer.imagem} alt={offer.nome} width="100" />
                <button onClick={() => handleDeleteOffer(offer._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Adicionar Procedimento</h2>
          <form onSubmit={handleAddProcedure}>
            <input
              type="text"
              placeholder="Nome"
              value={newProcedure.name}
              onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Metadata"
              value={newProcedure.metadata}
              onChange={(e) => setNewProcedure({ ...newProcedure, metadata: e.target.value })}
            />
            <input
              type="text"
              placeholder="Preço"
              value={newProcedure.price}
              onChange={(e) => setNewProcedure({ ...newProcedure, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={newProcedure.imageUrl}
              onChange={(e) => setNewProcedure({ ...newProcedure, imageUrl: e.target.value })}
            />
            <button type="submit">Adicionar Procedimento</button>
          </form>

          <h2>Procedimentos</h2>
          <ul>
            {procedures.map((proc) => (
              <li key={proc._id}>
                <h3>
                  {proc.name} - {proc.price}
                </h3>
                <button onClick={() => handleDeleteProcedure(proc._id)}>Excluir</button>
              </li>
            ))}
          </ul>

          <h2>Gerenciar Mensagens</h2>
          <form onSubmit={handleAddMessage}>
            <input
              type="text"
              placeholder="Nome"
              value={newMessage.name}
              onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Conteúdo"
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            />
            <input
              type="number"
              placeholder="Estrelas"
              value={newMessage.stars}
              onChange={(e) => setNewMessage({ ...newMessage, stars: e.target.value })}
            />
            <button type="submit">Enviar Mensagem</button>
          </form>

          <h2>Mensagens</h2>
          <ul>
            {messages.map((msg) => (
              <li key={msg._id}>
                <p>
                  {msg.name}: {msg.content} ({msg.stars} estrelas)
                </p>
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
