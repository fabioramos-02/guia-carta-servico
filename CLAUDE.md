# guia-carta-servico — instruções

Guia do CMS da carta de serviço **por perfil**: passo a passo com prints, vídeo e PDF. Next 16 + Design System MS
(`@plataforma-xvia/*` 0.14.4), export estático publicado na Vercel. Item no TFS: #1376742.

**Antes de começar um perfil ou uma ação nova, leia [`docs/05-processo-guia-com-ia.md`](docs/05-processo-guia-com-ia.md).**
O roteiro do vídeo é montado pelo Antonio em [`docs/roteiro-video-modelo.md`](docs/roteiro-video-modelo.md); a IA
transforma o roteiro numa jornada em `scripts/jornadas/<nome>.mjs` (`npm run jornada -- <nome> [id] --video`). Referência técnica dos scripts: [`docs/04-capturar-prints.md`](docs/04-capturar-prints.md).

## O processo (7 passos)

| # | Passo | Onde |
|---|---|---|
| 1 | Ler as fontes (TO BE, quadro de perfis, guia antigo) | `docs/materiais.md`, `docs/02-perfis.md` |
| 2 | Navegar no CMS com a IA, com o perfil certo, e anotar divergências | navegador do Claude; `docs/02-perfis.md` |
| 3 | Escrever as ações e os passos | `conteudo/<perfil>.ts` |
| 4 | Roteiro dos prints e captura | `ROTEIRO` em `scripts/capturar.mjs`; `npm run prints` |
| 5 | Roteiro do vídeo (Antonio) e gravação | `docs/roteiro-video-modelo.md` → `scripts/jornadas/<nome>.mjs`; `npm run jornada -- <nome> [id] --video` |
| 5b | GIF de cada passo (site) | `npm run gif -- <video>` → `public/gifs/`; campo `gif` do passo em `conteudo/<perfil>.ts` |
| 6 | PDF e conferência | `npm run build` e `npm run pdf` |
| 7 | Validação do Fabio e publicação | `npm run deploy` |

## Regras aprendidas (12/11/2026)

**Acesso e segurança**
- A IA não digita senha. O login é da pessoa, no Edge aberto por `npm run prints:login` (perfil em `.auth/`, fora do git).
- Antes de capturar, conferir o perfil logado (`/users/me?fields=role.name`). Admin vê menu que o Coordenador não vê.
- O site é público: nada de dado pessoal real. Foto e contador de notificações são escondidos (`ESCONDER`).
- Dado de teste se chama sempre **"Teste do guia - não publicar"** e é excluído no fim do mesmo script.

**CMS da carta (Directus, homologação)**
- A busca da lista fica salva entre visitas: limpar antes e depois (`buscar("")`).
- O menu recolhido fica no `localStorage` (`nav-bar-collapsed`): apagar antes de abrir a página (`abrirMenu`).
- Carta publicada não se edita direto: a mudança é feita na versão **Rascunho** (menu de versões no topo).
- Salvar volta para a lista de Serviços, não abre a carta.
- Obrigatórios: nome, categoria, órgão, o que é, documentos, quem pode utilizar, canal, tipo de prazo e prazo,
  tipo de custo. **Cada canal marcado precisa de ao menos uma etapa**, senão o CMS recusa.
- Categoria, subcategoria e órgão abrem uma gaveta de seleção.
- O "+" trava o Playwright: destacar o "+" e navegar direto para `/services/+`.
- A janela de gravação passa pelo SSO (keycloak) antes do formulário: esperar o formulário aparecer.
- O Coordenador não tem pré-visualizar (o Kauã vai fazer): ação com `previsto: true`.

**Prints**
- Padrão: tela 1440x900 em 2x. Enquadramento por passo (`recorte`): `tela` (2880x1800 cheia),
  `elemento` (só o destaque + 120 px) ou `secao` (contêiner pai + 60 px).
- Cada tela sai duas vezes, com o mesmo nome `<ação>-<n>-<tela>.png`: `prints-originais/<perfil>/` (sem
  marcação) e `public/prints/<perfil>/` (com destaque).
- **Três linguagens de destaque** (campo `tipo` no passo de `conteudo/<perfil>.ts` e no `ROTEIRO`),
  cores do DS MS: `acao` (azul `#1351B4` + badge com número do passo + sombra escurecendo o fora),
  `area` (fundo azul claro tracejado, sem sombra), `atencao` (âmbar `#D97706` + ícone `!`). Um
  destaque por vez; o número da badge casa com o `DsSteps` da página.
- Captura pelo CDP (`Page.captureScreenshot`); o `page.screenshot` ignora a escala nessa conexão.

**Vídeo**
- Legenda no pé da tela por passo ("Passo N de M · …"); destaque só no que vai ser clicado e some depois.
- Grava num contexto novo com a sessão copiada; no fim devolve os cookies ao Edge (o SSO renova a sessão).
- Limpeza pela API, com o mesmo usuário; o script avisa se o dado de teste sobrar.

**Jornadas (13/11/2026)**
- Uma jornada por arquivo em `scripts/jornadas/`; o executor é `scripts/jornada.mjs`. Ações de tela só em `acoes()` de `comum.mjs`.
- Carta de teste do Gerente: **2471** ("Carta de teste do guia (Gerente)", SAD). Pode enviar e cancelar à vontade.
- O `npm run prints` usa o perfil logado: `npm run prints -- gerente/` refaz só o Gerente (filtro em `perfil/arquivo`).

**Scripts**
- Terminar com `process.exit(0)`: `browser.close()` numa conexão CDP fecha o Edge e o login.
- O Chromium do Playwright não abre nesta máquina (`spawn UNKNOWN`): usar o Edge.
- O gov.br recusa navegador automatizado: o Edge é aberto como navegador comum e o script só se conecta depois.

**Conteúdo**
- Endereço do CMS só em `conteudo/ambiente.json` (homologação → produção: trocar e refazer prints e vídeo).
- No texto, `{cms}` vira o endereço; `onde` mostra o caminho no menu; `video` aceita arquivo local ou link do Drive.
- Linguagem simples (Lei 15.263/2025): frase curta, voz ativa, imperativo nos passos.
- O que o sistema mostra e difere do TO BE vai para `docs/02-perfis.md` e para a nota do vault.

**Design System, PDF e publicação**
- Componente do DS antes de markup próprio; ler a ficha em `https://designsystem.digital.ms.gov.br/llms/<tag>.md`.
  Server Component importa de `@plataforma-xvia/ds-react/server`. Cor, espaço e raio só por token `--ds-*`.
- Pacotes DS ficam vendorados em `vendor/*.tgz`; `package.json` tem `dependencies` + `overrides` em
  `file:./vendor/...tgz`, então `npm install` roda sem token do GitLab MS. Para atualizar: `cd vendor
  && npm pack @plataforma-xvia/ds-<pkg>@<ver>` na rede, trocar versão em `package.json` e reinstalar.
- PDF por `npm run pdf` (capa, sem data nem endereço do navegador, passo inteiro por página).
- A Vercel recebe o `out/` pronto (não faz build). `fetch failed` é rede do terminal.
- Rodapé: "Secretaria-Executiva de Transformação Digital — SETDIG".

## Base de conhecimento no vault
`60-padroes/time/guia-de-sistema-com-ia.md` (processo e papéis), `60-padroes/time/capturar-prints-de-sistema-logado.md`
(receita), `10-conhecimento/cms-carta-servico/navegar-no-cms-da-carta.md` (o CMS) e
`20-projeto/guia-carta-servico/00-guia-carta-servico.md` (o projeto).

## GIF no site, print no PDF (16/11/2026)

O Kauã elogiou o guia, e o passo a passo ficou mais claro com movimento. No site, o passo com `gif` mostra o GIF
no lugar do print. O PDF continua com o print: o GIF fica em `.so-tela` e o print em `.so-pdf`.

Como fazer para uma ação nova:
1. Grave a jornada com `--video`. O `jornada.mjs` grava junto `public/videos/<video>.passos.json`, com o segundo
   em que cada passo começa e termina.
2. Confira os trechos. Se um passo do guia juntar dois passos da jornada (ex.: escrever e clicar em Enviar), junte
   os tempos à mão no `.passos.json`. A numeração do arquivo é a dos passos do guia.
3. `npm run gif -- <video>` (ou `npm run gif -- <video> 2 3` para refazer só alguns). Sai em
   `public/gifs/<video>-<passo>.gif`.
4. No `conteudo/<perfil>.ts`, ponha `gif: "<video>-<passo>.gif"` no passo, ao lado do `print`.
5. `npm run build`, `npm run pdf` e conferir: o site mostra o GIF; o PDF, o print.

Regras:
- Vídeo antigo sem `.passos.json`: tire uma folha de quadros e marque os tempos olhando a legenda "Passo N de M".
  Foi assim no `gerente-enviar-para-aprovacao` (comando no histórico do commit).
- O `gif.mjs` usa o ffmpeg que vem com o Playwright, o mais novo das pastas do Playwright: o antigo (ffmpeg-1011)
  não lê o VP9 dos vídeos. Esse ffmpeg não tem o filtro `fps`: a taxa vai em `-r`.
- O GIF é montado em Python com Pillow (`scripts/montar_gif.py`): 6 quadros por segundo, 960 px de largura, último
  quadro parado 1,5 s. Cada GIF fica entre 0,8 e 1,8 MB. Se ficar pesado, baixe os quadros por segundo.
- Abrir o vídeo no Edge sem janela (headless) e tirar print do `<video>` sai em branco: não use esse caminho.

