// Conteúdo de exemplo, usado SOMENTE quando a API do backend não responde
// (fora do ar, erro de rede, CORS, etc.). Assim que o backend voltar a
// funcionar, os dados reais tomam o lugar automaticamente — nada aqui é
// salvo no banco nem enviado para o backend, é puramente visual.
export const DEMO_OFFERS = [
  {
    _id: 'demo-1',
    nome: 'Combo Cílios + Sobrancelha',
    imagem: '/images/cl2.jpeg',
    valor: 120,
    data_inicio: new Date().toISOString(),
    data_fim: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-2',
    nome: 'Design de Sobrancelha',
    imagem: '/images/cl3.jpeg',
    valor: 45,
    data_inicio: new Date().toISOString(),
    data_fim: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DEMO_PROCEDURES = [
  { _id: 'demo-1', name: 'Extensão de Cílios (fio a fio)', metadata: 'Duração aprox. 2h', price: 130, image: '/images/cl1.jpeg' },
  { _id: 'demo-2', name: 'Design de Sobrancelhas', metadata: 'Com henna', price: 45, image: '/images/cl2.jpeg' },
  { _id: 'demo-3', name: 'Depilação de Buço', metadata: 'Cera quente', price: 20, image: '/img_procedimentos/default.png' },
  { _id: 'demo-4', name: 'Manutenção de Cílios', metadata: 'Até 15 dias', price: 70, image: '/images/cl3.jpeg' },
];

export const DEMO_MESSAGES = [
  { _id: 'demo-1', name: 'Cliente satisfeita', content: 'Atendimento maravilhoso, super recomendo!', stars: 5, approved: true },
  { _id: 'demo-2', name: 'Cliente satisfeita', content: 'Ficou perfeito, adorei o resultado.', stars: 5, approved: true },
];
