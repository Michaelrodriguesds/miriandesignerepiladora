// Antes, cada componente tinha a URL do backend "hardcoded" (copiada e colada
// várias vezes). Aqui centralizamos tudo em um só lugar: se o backend mudar
// de endereço um dia, é só trocar a variável de ambiente NEXT_PUBLIC_API_URL.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://backende-deploy-site-mirian.onrender.com';

function authHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, auth = false, ...rest } = {}) {
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(auth ? authHeaders() : {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    let message = `Erro na requisição (${response.status})`;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // resposta sem corpo JSON, mantém a mensagem padrão
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ---- Endpoints públicos ----
export const getOffers = (opts) => request('/api/public/offers', opts);
export const getProcedures = (opts) => request('/api/public/procedures', opts);
export const getMessages = (opts) => request('/api/public/messages', opts);
export const sendMessage = (data) =>
  request('/api/public/messages', { method: 'POST', body: data });

// ---- Autenticação admin ----
export const adminLogin = (email, password) =>
  request('/api/admin/login', { method: 'POST', body: { email, password } });

// ---- Endpoints admin (autenticados) ----
export const getAdminMessages = () => request('/api/admin/messages', { auth: true });

export const addOffer = (data) =>
  request('/api/admin/offer', { method: 'POST', body: data, auth: true });
export const updateOffer = (id, data) =>
  request(`/api/admin/offer/${id}`, { method: 'PUT', body: data, auth: true });
export const deleteOffer = (id) =>
  request(`/api/admin/offer/${id}`, { method: 'DELETE', auth: true });

export const addProcedure = (data) =>
  request('/api/admin/procedure', { method: 'POST', body: data, auth: true });
export const updateProcedure = (id, data) =>
  request(`/api/admin/procedure/${id}`, { method: 'PUT', body: data, auth: true });
export const deleteProcedure = (id) =>
  request(`/api/admin/procedure/${id}`, { method: 'DELETE', auth: true });

export const addMessage = (data) =>
  request('/api/admin/message', { method: 'POST', body: data, auth: true });
export const updateMessage = (id, data) =>
  request(`/api/admin/message/${id}`, { method: 'PUT', body: data, auth: true });
export const approveMessage = (id) =>
  request(`/api/admin/message/${id}/approve`, { method: 'PUT', auth: true });
export const deleteMessage = (id) =>
  request(`/api/admin/message/${id}`, { method: 'DELETE', auth: true });
