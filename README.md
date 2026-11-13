# Mirian Vasconcelos — Site (Next.js)

Site institucional/vitrine da Mirian Designer, migrado de **React + Vite** para
**Next.js 14 (App Router)**. O backend (Node/Express + MongoDB, no repositório
`backende-Deploy`) **não muda** — este projeto continua consumindo a mesma API.

---

## 1. O que mudou (e por quê)

| Antes (Vite) | Agora (Next.js) | Ganho |
|---|---|---|
| `react-router-dom` com `<Route>` manual | Roteamento por pastas (`app/page.jsx`, `app/admin/page.jsx`) | Menos código, menos dependência |
| Ofertas e Procedimentos buscados no navegador (`useEffect` + `fetch`), com tela de "Carregando..." | Buscados **no servidor**, antes de enviar o HTML | Carrega mais rápido, melhor para Google/SEO, sem "flash" de loading |
| URL da API repetida em ~10 lugares diferentes | Centralizada em `lib/api.js` | Fácil de trocar/manter |
| `<link>` do Google Fonts no `<head>` | `next/font` (baixa e otimiza a fonte no build) | Fonte carrega mais rápido, sem depender do Google em tempo de acesso |
| Meta tags soltas no `index.html` | API de Metadata do Next.js (`app/layout.jsx`) | Mais fácil de customizar por página no futuro |
| `<img>` simples para logo/galeria/certificados | `next/image` | Otimização automática de imagem (tamanho, formato) |
| Rota `/admin` sem proteção de indexação | `robots: noindex` na página do admin | Google não indexa a área administrativa |

O **visual, o CSS e o comportamento de cada seção foram mantidos exatamente
como estavam** (mesmas classes CSS, mesmo HTML). Isso foi proposital: a troca
de framework não deveria, por si só, mudar a aparência do site.

---

## 2. Estrutura do projeto

```
nextapp/
├── app/
│   ├── layout.jsx          # Layout raiz: fonte, metadata/SEO, <html>/<body>
│   ├── globals.css         # Antigo src/index.css
│   ├── page.jsx            # Rota "/" — página inicial (antigo App.jsx)
│   └── admin/
│       └── page.jsx        # Rota "/admin"
│
├── components/
│   ├── Header/              (Client Component — menu, scroll)
│   ├── About/                (Server Component — conteúdo estático)
│   ├── Certificacao/         (Client Component — modal de certificados)
│   ├── Gallery/               (Client Component — lightbox)
│   ├── Offers/
│   │   ├── Offers.jsx        (Server Component — busca dados no servidor)
│   │   └── OffersList.jsx    (Client Component — só a parte interativa)
│   ├── Procedures/
│   │   ├── Procedures.jsx    (Server Component — busca dados no servidor)
│   │   └── ProceduresList.jsx(Client Component — grade + zoom/arraste)
│   ├── Messages/              (Client Component — carrossel + formulário)
│   ├── Footer/                (Client Component — botão WhatsApp)
│   └── Admin/                 (Client Component — login + CRUD)
│
├── lib/
│   └── api.js               # Todas as chamadas à API centralizadas aqui
│
├── public/
│   ├── icone.nav.png         # Favicon
│   ├── img_procedimentos/default.png
│   └── images/                # Logo, galeria, certificados, fundo do "Sobre"
│
├── .env.local.example
├── next.config.mjs
├── jsconfig.json             # Permite importar com "@/lib/api" em vez de "../../lib/api"
└── package.json
```

**Por que alguns componentes viraram "Server" e outros "Client"?**
No App Router do Next.js, todo componente é Server Component por padrão (mais
rápido, roda no servidor). Só precisa virar Client Component (`'use client'`
no topo do arquivo) quem usa `useState`, `useEffect`, eventos de clique,
`localStorage`, `window`, etc. Por isso `About` (só texto) ficou Server, e
`Header`, `Gallery`, `Messages`, `Admin` etc. ficaram Client.

Em `Offers` e `Procedures` eu dividi em dois arquivos: um Server Component que
busca os dados (`Offers.jsx` / `Procedures.jsx`) e um Client Component que só
cuida da parte interativa — modal, zoom (`OffersList.jsx` / `ProceduresList.jsx`).
Assim o carregamento inicial da lista é instantâneo (já vem pronto do
servidor) e só o clique no card/modal depende de JavaScript no navegador.

---

## 3. Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) 18.18 ou superior.

```bash
# 1. Entrar na pasta do projeto
cd nextapp

# 2. Instalar as dependências
npm install

# 3. (Opcional) copiar o arquivo de variáveis de ambiente
cp .env.local.example .env.local
# Por padrão já aponta para a API em produção (backende-deploy.onrender.com),
# então esse passo só é necessário se você for rodar a API localmente também.

# 4. Rodar em modo desenvolvimento
npm run dev
```

Abra `http://localhost:3000` para a página inicial e
`http://localhost:3000/admin` para a área administrativa.

### Outros comandos

```bash
npm run build   # Gera a build de produção (pasta .next/)
npm run start   # Roda a build de produção localmente (depois do build)
npm run lint    # Roda o ESLint
```

---

## 4. Deploy

O jeito mais simples é a [Vercel](https://vercel.com) (criadora do Next.js,
deploy gratuito para projetos pessoais):

1. Suba este projeto para um repositório no GitHub (pode ser um novo repo, ou
   substituir o conteúdo do `miriandesignerepiladora` atual).
2. Na Vercel: **New Project** → selecione o repositório → **Deploy**.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_API_URL` = `https://backende-deploy.onrender.com`
4. Pronto — a cada `git push` na branch principal, a Vercel gera um novo
   deploy automaticamente.

Também é possível fazer deploy no Render (mesmo lugar onde o site atual e o
backend já estão hospedados), usando:
- Build command: `npm run build`
- Start command: `npm run start`

---

## 5. Pontos de atenção / sugestões de melhoria futura

Coisas que eu **mantive fiéis ao comportamento original** mas que valem a
pena revisar quando fizer sentido para o negócio:

- **Credenciais de admin fixas no código** (`Admin.jsx` decide o nome exibido
  comparando o e-mail digitado com dois e-mails fixos no código). Funciona,
  mas o ideal a médio prazo é o próprio backend devolver o nome do
  administrador no login, em vez do frontend "adivinhar".
- **Token de admin em `localStorage`**: mantive assim porque era o
  comportamento original, mas é sensível a ataques XSS. Uma evolução futura
  seria usar cookies `httpOnly` (exigiria mudanças no backend também).
- **`offer.imagem` e `procedure.image` como URLs completas cadastradas no
  admin**: continuam sendo renderizadas com `<img>` comum (não `next/image`),
  porque são URLs externas e imprevisíveis. Dá para otimizar isso configurando
  os domínios permitidos em `next.config.mjs` (`images.remotePatterns`), se
  quiser.
- Notei que o card de oferta tem um fallback para `/img_ofertas/default.png`,
  mas esse arquivo não existe nem existia no projeto original — se quiser,
  posso criar essa imagem padrão.

---

## 7. Redesign visual — estilo "Cordel"

A versão atual usa o **mesmo estilo visual do projeto Cordel (Milton Duarte)**,
mantendo todo o conteúdo e os dados vindos do backend:

- **Cabeçalho e rodapé pretos**, com menu em âncoras (`#about`, `#gallery`,
  `#procedures`, `#offers`, `#messages`, `#footer`).
- **Faixas alternadas**: `section.normal` (fundo branco, texto preto) e
  `section.imagem` (foto de fundo fixa, sombra interna e texto dentro de uma
  caixa preta translúcida `.box`). Em telas até 900px a foto deixa de ser
  fixa (melhor no celular).
- **Tipografia** (via `next/font`, em `app/layout.jsx`): `Passion One` em
  versalete para títulos, `Sriracha` (manuscrita) para textos e `verdana`
  como base.
- **Tabela de preços**: linhas com miniatura, nome, linha pontilhada e preço
  em `R$ 130,00`. Ofertas em cartões brancos sobre foto. Recados como um
  "verso" com barra preta ao lado do formulário.
- Classes de modal compartilhadas (`.overlay`, `.overlay-box`, ...) em
  `app/globals.css`, e o painel admin isolado em `.admin-container`.

O **comportamento e a lógica de dados não mudaram** em nenhuma versão —
mesmos endpoints da API, mesmo fluxo de admin. Se o backend não responder, as
seções mostram conteúdo de exemplo com um aviso.

### Correção de robustez (todas as versões a partir desta)
Os componentes que abrem modais de imagem (Galeria, Certificações, Ofertas,
Procedimentos) agora usam um hook único, `lib/useBodyScrollLock.js`, para
travar/destravar a rolagem da página. Antes, cada componente mexia em
`document.body.style.overflow` por conta própria, o que podia causar
travamentos de rolagem em cenários de uso simultâneo.

### Versões anteriores
Ficaram salvas fora deste zip: `mirian-designer-nextjs-v2-profissional-BACKUP.zip`
(hero de duas colunas, `Playfair Display` + `Inter`) e
`mirian-designer-nextjs-v3-bento-BACKUP.zip` (bento grid). Se preferir voltar a
ela, é só extrair aquele zip por cima deste.

---

## 8. Dependências removidas

- `react-router-dom`: não é mais necessária — o Next.js já tem roteamento
  próprio por pastas.
- `vite` e plugins do Vite: substituídos pelo próprio `next` (dev server,
  build e bundler).

Dependências mantidas: `react-icons` (ícones) e `react-toastify`
(notificações no admin).
