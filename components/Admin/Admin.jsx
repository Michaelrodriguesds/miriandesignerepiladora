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
  updateOffer,
  deleteOffer,
  addProcedure,
  updateProcedure,
  deleteProcedure,
  addMessage,
  updateMessage,
  approveMessage,
  deleteMessage,
} from '@/lib/api';
import './Admin.css';

const REFRESH_INTERVAL = 5000;

// ---- Formatação ------------------------------------------------------------
// As datas são guardadas à meia-noite UTC; sem timeZone 'UTC' apareceria 1 dia antes no Brasil.
const fmtDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};
const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};
const fmtMoney = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
};

// ---- Campos dos formulários de edição --------------------------------------
const OFFER_FIELDS = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'descricao', label: 'Descrição', type: 'text' },
  { key: 'valor', label: 'Valor (R$)', type: 'number', step: '0.01', min: '0' },
  { key: 'data_inicio', label: 'Data de início', type: 'date' },
  { key: 'data_fim', label: 'Data de fim', type: 'date' },
  { key: 'imagem', label: 'URL da imagem', type: 'text' },
];
const PROCEDURE_FIELDS = [
  { key: 'name', label: 'Nome', type: 'text', required: true },
  { key: 'metadata', label: 'Detalhe (ex.: duração, técnica)', type: 'text', required: true },
  { key: 'price', label: 'Preço (R$)', type: 'text', inputMode: 'decimal', required: true },
  { key: 'image', label: 'URL da imagem (vazio = imagem padrão)', type: 'text' },
];
const MESSAGE_FIELDS = [
  { key: 'name', label: 'Nome', type: 'text', required: true },
  { key: 'content', label: 'Mensagem', textarea: true, required: true },
  { key: 'stars', label: 'Estrelas (1 a 5)', type: 'number', min: '1', max: '5', step: '1', required: true },
];

// Valores iniciais do formulário de edição (tudo como texto, para comparar o que mudou)
const initialDraft = (kind, item) => {
  if (kind === 'offer') {
    return {
      nome: item.nome || '',
      descricao: item.descricao || '',
      valor: item.valor == null ? '' : String(item.valor),
      data_inicio: toDateInput(item.data_inicio),
      data_fim: toDateInput(item.data_fim),
      imagem: item.imagem || '',
    };
  }
  if (kind === 'procedure') {
    return {
      name: item.name || '',
      metadata: item.metadata || '',
      price: item.price == null ? '' : String(item.price),
      image: item.image || '',
    };
  }
  return {
    name: item.name || '',
    content: item.content || '',
    stars: item.stars == null ? '' : String(item.stars),
  };
};

// Fica FORA do componente Admin de propósito: se fosse criado dentro, o campo perderia
// o foco a cada letra digitada.
const EditForm = ({ fields, draft, onChange, onSave, onCancel, saving }) => (
  <form
    className="edit-form"
    onSubmit={(e) => {
      e.preventDefault();
      onSave();
    }}
  >
    {fields.map((f) => (
      <label key={f.key}>
        <span>{f.label}</span>
        {f.textarea ? (
          <textarea
            rows="3"
            value={draft[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
            required={f.required}
          />
        ) : (
          <input
            type={f.type}
            step={f.step}
            min={f.min}
            max={f.max}
            inputMode={f.inputMode}
            value={draft[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
            required={f.required}
          />
        )}
      </label>
    ))}
    <div className="admin-actions">
      <button type="submit" disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar alterações'}
      </button>
      <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
        Cancelar
      </button>
    </div>
  </form>
);

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('');

  const [offers, setOffers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [messages, setMessages] = useState([]);

  // Item em edição: { kind: 'offer' | 'procedure' | 'message', id, original, draft }
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

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

  // O token vale 1 hora. Quando vence, volta para a tela de login em vez de ficar dando erro.
  const handleAuthError = (error) => {
    if (/token|acesso negado/i.test(error?.message || '')) {
      localStorage.removeItem('token');
      setEditing(null);
      setIsAuthenticated(false);
      toast.error('Sua sessão expirou. Entre novamente.', { toastId: 'sessao-expirada' });
      return true;
    }
    return false;
  };

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
      if (handleAuthError(error)) return;
      toast.error(error.message || 'Erro ao carregar dados', { toastId: 'erro-carregar' });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const interval = setInterval(fetchAllData, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isAuthenticated]);

  // ---- Edição ---------------------------------------------------------------
  const startEdit = (kind, item) => {
    const draft = initialDraft(kind, item);
    setEditing({ kind, id: item._id, original: draft, draft });
  };
  const cancelEdit = () => setEditing(null);
  const changeDraft = (key, value) =>
    setEditing((prev) => (prev ? { ...prev, draft: { ...prev.draft, [key]: value } } : prev));
  const isEditing = (kind, id) => editing && editing.kind === kind && editing.id === id;

  const saveEdit = async () => {
    if (!editing) return;
    const { kind, id, original, draft } = editing;

    // Envia só o que foi alterado (assim textos-padrão como "Descrição não disponível" não são gravados)
    const changes = {};
    Object.keys(draft).forEach((key) => {
      if (draft[key] !== original[key]) changes[key] = draft[key];
    });
    if (Object.keys(changes).length === 0) {
      toast.info('Nada foi alterado.');
      setEditing(null);
      return;
    }

    setSaving(true);
    try {
      if (kind === 'offer') await updateOffer(id, changes);
      if (kind === 'procedure') await updateProcedure(id, changes);
      if (kind === 'message') await updateMessage(id, changes);
      toast.success('Alterações salvas!');
      setEditing(null);
      await fetchAllData();
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const editFormFor = (kind, fields) => (
    <EditForm
      fields={fields}
      draft={editing.draft}
      onChange={changeDraft}
      onSave={saveEdit}
      onCancel={cancelEdit}
      saving={saving}
    />
  );

  // ---- Ofertas --------------------------------------------------------------
  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await addOffer(newOffer);
      toast.success('Oferta adicionada com sucesso!');
      setNewOffer({ nome: '', descricao: '', valor: '', data_inicio: '', data_fim: '', imagem: '' });
      fetchAllData();
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao adicionar oferta');
    }
  };

  const handleDeleteOffer = async (offer) => {
    if (!window.confirm(`Excluir a oferta "${offer.nome}"?`)) return;
    try {
      await deleteOffer(offer._id);
      setOffers((prev) => prev.filter((o) => o._id !== offer._id));
      toast.success('Oferta excluída com sucesso!');
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao excluir oferta');
    }
  };

  // ---- Procedimentos --------------------------------------------------------
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
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao adicionar procedimento');
    }
  };

  const handleDeleteProcedure = async (proc) => {
    if (!window.confirm(`Excluir o procedimento "${proc.name}"?`)) return;
    try {
      await deleteProcedure(proc._id);
      setProcedures((prev) => prev.filter((p) => p._id !== proc._id));
      toast.success('Procedimento excluído com sucesso!');
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao excluir procedimento');
    }
  };

  // ---- Mensagens ------------------------------------------------------------
  const handleApproveMessage = async (id) => {
    try {
      await approveMessage(id);
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, approved: true } : msg)));
      toast.success('Mensagem aprovada com sucesso!');
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao aprovar mensagem');
    }
  };

  const handleHideMessage = async (id) => {
    try {
      await updateMessage(id, { approved: false });
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, approved: false } : msg)));
      toast.success('Mensagem ocultada do site.');
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao ocultar mensagem');
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Excluir a mensagem de "${msg.name}"?`)) return;
    try {
      await deleteMessage(msg._id);
      toast.success('Mensagem excluída com sucesso!');
      fetchAllData();
    } catch (error) {
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao excluir mensagem');
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
      if (!handleAuthError(error)) toast.error(error.message || 'Erro ao adicionar mensagem');
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
            {offers.map((offer) =>
              isEditing('offer', offer._id) ? (
                <li key={offer._id} className="editing">
                  <h3>Editando oferta</h3>
                  {editFormFor('offer', OFFER_FIELDS)}
                </li>
              ) : (
                <li key={offer._id}>
                  <div className="item-info">
                    <h3>
                      {offer.nome} - {fmtMoney(offer.valor)}
                    </h3>
                    <p>{offer.descricao}</p>
                    <p>
                      Início: {fmtDate(offer.data_inicio)} - Fim: {fmtDate(offer.data_fim)}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {offer.imagem && <img src={offer.imagem} alt={offer.nome} width="100" />}
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEdit('offer', offer)}>
                      Editar
                    </button>
                    <button type="button" className="secondary" onClick={() => handleDeleteOffer(offer)}>
                      Excluir
                    </button>
                  </div>
                </li>
              )
            )}
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
            {procedures.map((proc) =>
              isEditing('procedure', proc._id) ? (
                <li key={proc._id} className="editing">
                  <h3>Editando procedimento</h3>
                  {editFormFor('procedure', PROCEDURE_FIELDS)}
                </li>
              ) : (
                <li key={proc._id}>
                  <div className="item-info">
                    <h3>
                      {proc.name} - {fmtMoney(proc.price)}
                    </h3>
                    <p>{proc.metadata}</p>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEdit('procedure', proc)}>
                      Editar
                    </button>
                    <button type="button" className="secondary" onClick={() => handleDeleteProcedure(proc)}>
                      Excluir
                    </button>
                  </div>
                </li>
              )
            )}
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
            {messages.map((msg) =>
              isEditing('message', msg._id) ? (
                <li key={msg._id} className="editing">
                  <h3>Editando mensagem</h3>
                  {editFormFor('message', MESSAGE_FIELDS)}
                </li>
              ) : (
                <li key={msg._id}>
                  <div className="item-info">
                    <p>
                      {msg.name}: {msg.content} ({msg.stars} estrelas)
                    </p>
                    <p className="status">{msg.approved ? 'Visível no site' : 'Aguardando aprovação'}</p>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEdit('message', msg)}>
                      Editar
                    </button>
                    {msg.approved ? (
                      <button type="button" className="secondary" onClick={() => handleHideMessage(msg._id)}>
                        Ocultar do site
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleApproveMessage(msg._id)}>
                        Aprovar
                      </button>
                    )}
                    <button type="button" className="secondary" onClick={() => handleDeleteMessage(msg)}>
                      Excluir
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
