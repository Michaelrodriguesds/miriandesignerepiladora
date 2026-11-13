# Guia para Windows — do zero ao site rodando

Este guia assume que você tem **Node.js**, **Python** e **VS Code** instalados,
mas nunca usou **Next.js**. O Python não entra em nada aqui — este projeto é
100% JavaScript/Node, então pode ignorá-lo por enquanto.

---

## Passo a passo (instalar e rodar)

### 1. Confira o Node.js instalado
Abra o **Prompt de Comando** ou **PowerShell** (menu Iniciar → digite "cmd") e rode:
```bat
node -v
npm -v
```
Precisa aparecer Node **18.18 ou superior**. Se der erro "não é reconhecido",
baixe a versão **LTS** em https://nodejs.org e instale marcando a opção de
adicionar ao PATH.

### 2. Extraia o projeto
Clique com o botão direito no `mirian-designer-nextjs.zip` → **Extrair Tudo...**
Escolha uma pasta fácil de achar, por exemplo `C:\Projetos\`. Você vai ficar
com a pasta `nextapp` dentro dela.

### 3. Abra no VS Code
No VS Code: **Arquivo → Abrir Pasta** → selecione `nextapp`.

### 4. Abra o terminal integrado
Menu **Terminal → New Terminal** (ou `Ctrl+\``). Ele já abre dentro da pasta
do projeto — todos os comandos abaixo são digitados aqui.

### 5. Instale as dependências
```bat
npm install
```
Baixa tudo que o projeto precisa para a pasta `node_modules`. Demora de 1 a 3
minutos na primeira vez.

### 6. (Opcional) configure a URL da API
O projeto já aponta por padrão para a API em produção. Se quiser deixar
explícito:
```bat
copy .env.local.example .env.local
```
No Windows o comando é `copy`, não `cp` (isso é Mac/Linux).

### 7. Rode o projeto
```bat
npm run dev
```
Espere aparecer `Local: http://localhost:3000` e abra essa URL no navegador.
A área administrativa fica em `http://localhost:3000/admin`. Para parar,
volte ao terminal e aperte `Ctrl+C`.

### 8. Edite e veja mudando ao vivo
Com o `npm run dev` rodando, abra qualquer arquivo em `components/`, mude um
texto, salve (`Ctrl+S`) — o navegador atualiza sozinho ("hot reload").

---

## Conceitos do Next.js que você precisa saber (do zero)

Você vinha de um projeto **Vite + React**, onde:
- O navegador baixava um `.js` vazio e o React "desenhava" tudo depois, no
  próprio navegador.
- As rotas (`/`, `/admin`) eram controladas por uma biblioteca (`react-router-dom`).

No **Next.js**, muda a forma de pensar em três pontos:

### a) Rotas são pastas, não código
Não existe mais `<Route path="/admin">`. A pasta `app/admin/` com um
`page.jsx` dentro **já é** a rota `/admin`. Se um dia quiser criar
`/contato`, basta criar `app/contato/page.jsx`.

### b) Server Components vs. Client Components
Essa é a maior mudança de mentalidade:
- **Server Component** (padrão): o código roda **no servidor**, antes de
  mandar o HTML pronto para o navegador. Não pode usar `useState`,
  `useEffect`, `onClick`, `window`, `localStorage`.
- **Client Component**: você escreve `'use client'` na primeira linha do
  arquivo, e a partir daí ele funciona exatamente como um componente React
  "normal" que você já conhecia no Vite — pode usar hooks, eventos, etc.

No projeto, `About.jsx` é Server Component (só texto, sem interação).
`Header.jsx`, `Admin.jsx`, `Messages.jsx` etc. são Client Components (têm
`'use client'` no topo) porque usam `useState`/`useEffect`.

`Offers.jsx` e `Procedures.jsx` são um caso especial: o arquivo principal é
Server Component e **busca os dados direto no servidor**, e passa esses
dados prontos para um componente filho (`OffersList.jsx` /
`ProceduresList.jsx`) que é Client Component só para cuidar do clique/modal.

### c) Importação de imagens e CSS
- Imagens fixas do site (logo, galeria, certificados) ficam em `public/` e
  são referenciadas por caminho direto, tipo `/images/logo.png` — não tem
  mais aquele `import logo from './assets/logo.png'` do Vite.
- O CSS de cada componente continua sendo importado normalmente
  (`import './Header.css'`) e funciona igual ao que você já conhecia.

### d) Variáveis de ambiente
No Vite era `import.meta.env.VITE_ALGO`. No Next.js, qualquer variável que
o navegador precisa enxergar tem que começar com `NEXT_PUBLIC_` (por isso
`NEXT_PUBLIC_API_URL` no arquivo `.env.local`).

---

## Comandos que você vai usar sempre

| Comando | O que faz | Quando usar |
|---|---|---|
| `npm install` | Baixa as dependências | Só precisa rodar de novo se o `package.json` mudar |
| `npm run dev` | Roda o site em modo desenvolvimento, com hot reload | No dia a dia, enquanto edita o código |
| `npm run build` | Gera a versão de produção, otimizada | Antes de publicar, para checar se não tem erro |
| `npm run start` | Roda a versão gerada pelo `build` | Para testar a versão final antes do deploy |
| `Ctrl+C` (no terminal) | Para o servidor | Quando quiser encerrar o `dev` ou o `start` |

---

## Erros comuns no Windows e como resolver

- **`'npm' não é reconhecido como comando interno ou externo`**: o Node.js
  não foi instalado corretamente ou não está no PATH. Reinstale pelo
  instalador oficial (nodejs.org) e reinicie o VS Code depois.
- **Porta 3000 já em uso**: outro programa (ou outro `npm run dev` que você
  esqueceu aberto em outro terminal) já está usando essa porta. Fecha o
  outro processo, ou rode `npm run dev -- -p 3001` para usar a porta 3001.
- **Erros estranhos depois de puxar/copiar o projeto de novo**: apague a
  pasta `node_modules` e o arquivo `.next` (se existir) e rode `npm install`
  de novo. No terminal do VS Code:
  ```bat
  rmdir /s /q node_modules
  npm install
  ```
- **Antivírus/Windows Defender lento no `npm install`**: é normal a primeira
  instalação demorar mais no Windows por causa da checagem de arquivos —
  não precisa fazer nada, só esperar.

---

## Depois que estiver rodando localmente: publicar o site

Veja a seção "4. Deploy" no `README.md` deste projeto — o caminho mais
simples é subir este código para um repositório no GitHub e conectar na
Vercel (gratuito, poucos cliques, deploy automático a cada alteração).
