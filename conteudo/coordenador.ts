import type { Perfil } from "./tipos";

// Conferido no CMS de homologação em 12/11/2026, com o perfil Coordenador (órgão SAD).
// Prints: scripts/capturar.mjs (mesmo nome de arquivo do campo `print`).
// Ordem das ações = jornada: entrar, achar, criar, mudar, corrigir, histórico (Fabio, 17/11/2026).
export const coordenador: Perfil = {
  id: "coordenador",
  nome: "Coordenador",
  resumo: "Escreve e corrige as cartas de serviço do órgão. Quem envia para aprovação é o Gerente.",
  situacao: "pronto",
  pode: [
    "Ver as cartas dos órgãos em que atua",
    "Criar uma carta nova e salvar",
    "Propor mudança numa carta publicada, pela versão Rascunho",
    "Ver o histórico da carta",
  ],
  naoPode: [
    "Enviar a carta para aprovação (é o Gerente)",
    "Aprovar ou devolver uma carta (é o Aprovador Central, da CGE)",
    "Excluir uma carta. Nem o Administrador exclui: a carta só pode ficar Inativa",
    "Ver cartas de outros órgãos",
  ],
  acoes: [
    {
      id: "entrar",
      titulo: "Entrar no CMS",
      objetivo: "Abrir o gerenciador de cartas com o seu usuário.",
      passos: [
        { titulo: "Abra o endereço do CMS", texto: "No navegador, acesse {cms}.", print: "" },
        { titulo: "Clique em Entrar com SSO", texto: "Entre com o seu acesso. Na primeira vez, a SETDIG libera o seu perfil e o seu órgão.", print: "entrar-1-login.png", onde: "Tela de login", tipo: "acao", recorte: "elemento" },
        {
          titulo: "Conheça o menu",
          texto: "À esquerda fica a área Carta de Serviço. Você vai usar mais o item Serviços, que lista as cartas do seu órgão.",
          print: "entrar-2-menu.png",
          onde: "Menu à esquerda › Carta de Serviços",
          tipo: "area",
          recorte: "secao",
        },
      ],
    },
    {
      id: "encontrar",
      titulo: "Encontrar uma carta",
      objetivo: "Achar a carta do seu órgão na lista.",
      passos: [
        {
          titulo: "Abra Serviços",
          texto: "A lista mostra nome, categoria, órgão e situação (Ativo ou Inativo) de cada carta do seu órgão.",
          print: "encontrar-1-lista.png",
          onde: "Carta de Serviços › Serviços",
          tipo: "acao",
          recorte: "secao",
        },
        { titulo: "Busque pelo nome", texto: "Clique na lupa, no alto da lista, e digite parte do nome do serviço.", print: "encontrar-2-busca.png", onde: "Serviços › lupa no alto da lista", tipo: "acao", recorte: "elemento" },
        { titulo: "Abra a carta", texto: "Clique na linha da carta. Ela abre na aba Descrição do Serviço.", print: "encontrar-3-carta.png", onde: "Serviços › carta escolhida", tipo: "area", recorte: "tela" },
      ],
    },
    {
      id: "criar",
      titulo: "Criar uma carta",
      objetivo: "Cadastrar um serviço novo.",
      video: "/videos/coordenador-criar-carta.webm",
      passos: [
        { titulo: "Comece uma carta nova", texto: "Em Serviços, clique no botão + no alto da lista.", print: "criar-0-novo.png", gif: "coordenador-criar-carta-1.gif", onde: "Serviços › botão + no alto", tipo: "acao", recorte: "elemento" },
        {
          titulo: "Aba 1 — Descrição do Serviço",
          texto: "Preencha nome do serviço (3 a 5 palavras, começando por verbo), categoria e subcategoria, órgão, o que é o serviço, documentos necessários e quem pode utilizar. Público específico, nome popular, saiba mais e palavras-chave ajudam o cidadão a achar o serviço.",
          print: "criar-1-descricao.png", gif: "coordenador-criar-carta-2.gif",
          onde: "Serviços › + › aba Descrição do Serviço",
          tipo: "area",
          recorte: "secao",
        },
        {
          titulo: "Aba 2 — Etapa do Serviço",
          texto: "Escolha o canal de prestação (presencial, online ou os dois) e escreva cada etapa na ordem em que a pessoa faz. Cada canal marcado precisa de ao menos uma etapa (botão Criar novo), senão o CMS não salva.",
          print: "criar-2-etapas.png", gif: "coordenador-criar-carta-3.gif",
          onde: "Serviços › + › aba Etapa do Serviço",
          tipo: "area",
          recorte: "secao",
        },
        {
          titulo: "Aba 3 — Detalhes do Serviço",
          texto: "Informe o prazo de atendimento, o tipo de custo (gratuito ou pago), os locais de atendimento e o link do serviço, se houver.",
          print: "criar-3-detalhes.png", gif: "coordenador-criar-carta-4.gif",
          onde: "Serviços › + › aba Detalhes do Serviço",
          tipo: "area",
          recorte: "secao",
        },
        {
          titulo: "Salve",
          texto: "Clique no botão de confirmar (✓), no alto à direita. Os campos com asterisco são obrigatórios.",
          print: "criar-4-salvar.png", gif: "coordenador-criar-carta-5.gif",
          onde: "Carta nova › botão ✓ no alto à direita",
          tipo: "acao",
          recorte: "elemento",
        },
        // ponytail: passo depois do Salve para não mexer na numeração das badges dos prints e GIFs (1 a 5)
        {
          titulo: "Confira como o cidadão vai ver",
          texto: "Abra a pré-visualização e confira a carta como ela vai aparecer no portal. Depois, avise o Gerente para enviar a carta para aprovação.",
          previsto: true,
        },
      ],
    },
    {
      id: "mudar-publicada",
      titulo: "Mudar uma carta publicada",
      objetivo: "Propor correção numa carta que já está no portal, sem tirar a versão atual do ar.",
      aviso: "A carta publicada não se edita direto. A mudança é feita na versão Rascunho e só vai ao portal depois de aprovada.",
      passos: [
        {
          titulo: "Veja o aviso no alto da carta",
          texto: "Carta publicada mostra \"Visível no portal — você está na versão principal\".",
          print: "mudar-1-aviso.png",
          onde: "Serviços › carta publicada › aviso no alto",
          tipo: "atencao",
          recorte: "elemento",
        },
        {
          titulo: "Abra o menu de versões",
          texto: "Clique no nome da versão, ao lado de Serviços, no alto da página. Escolha Rascunho. Se não existir, use Criar Versão.",
          print: "mudar-2-versoes.png",
          onde: "Carta › nome da versão (Main), no alto",
          tipo: "acao",
          recorte: "elemento",
        },
        {
          titulo: "Edite o rascunho e salve",
          texto: "Mude os campos e salve (✓). Enquanto o rascunho estiver igual à carta publicada, o CMS avisa que não há o que o aprovador analisar.",
          print: "mudar-3-rascunho.png",
          onde: "Carta › versão Rascunho",
          tipo: "atencao",
          recorte: "elemento",
        },
        { titulo: "Avise o Gerente", texto: "O Gerente envia o rascunho para o Aprovador Central.", print: "" },
      ],
    },
    {
      id: "corrigir-devolvida",
      titulo: "Corrigir uma carta devolvida",
      objetivo: "Ajustar a carta que o Aprovador Central devolveu. Só o Gerente recebe o aviso da devolução.",
      aviso: "O CMS avisa só o Gerente. Ele repassa ao Coordenador o que precisa mudar.",
      passos: [
        { titulo: "Receba os apontamentos do Gerente", texto: "O Gerente diz qual carta voltou e o que o Aprovador Central pediu.", print: "" },
        { titulo: "Abra a carta devolvida", texto: "Abra a carta e a versão Rascunho.", print: "" },
        { titulo: "Corrija os campos apontados", texto: "Mude só o que foi pedido e salve.", print: "" },
        { titulo: "Avise o Gerente", texto: "O Gerente reenvia a carta para aprovação.", print: "" },
      ],
    },
    {
      id: "historico",
      titulo: "Ver o histórico",
      objetivo: "Saber quem mudou a carta e quando.",
      passos: [
        {
          titulo: "Abra a aba Histórico",
          texto: "É a aba 5 da carta. Mostra as aprovações e quem criou e atualizou a carta, com data e hora.",
          print: "historico-1-aba.png",
          onde: "Carta › aba 5 Histórico",
          tipo: "area",
          recorte: "secao",
        },
        {
          titulo: "Use Revisões, na lateral direita",
          texto: "Lista cada alteração salva. Em Comentários, você deixa um recado para quem cuida da carta.",
          print: "",
        },
      ],
    },
  ],
};
