import type { Perfil } from "./tipos";

// Conferido no CMS de homologação em 13/11/2026, com o perfil Gerente (órgão SAD), na carta de teste 2471.
// Guia macro: só o que é do Gerente. Criar, encontrar e editar carta estão no guia do Coordenador.
// Prints: scripts/capturar.mjs (mesmo nome de arquivo do campo `print`).
export const gerente: Perfil = {
  id: "gerente",
  nome: "Gerente",
  resumo: "Responde pelas cartas do órgão: envia para aprovação, acompanha o pedido e cuida das unidades.",
  situacao: "pronto",
  pode: [
    "Tudo o que o Coordenador faz: criar, encontrar e editar cartas (veja o guia do Coordenador)",
    "Enviar a carta para aprovação e cancelar o envio",
    "Acompanhar os pedidos e corrigir a carta devolvida",
    "Mudar uma carta publicada, pela versão Rascunho",
    "Cuidar dos dados do órgão e das unidades de atendimento",
  ],
  naoPode: [
    "Aprovar ou devolver uma carta (é o Aprovador Central, da CGE)",
    "Criar categoria ou subcategoria (é o Administrador)",
    "Cadastrar usuários (é o Administrador)",
    "Ver cartas de outros órgãos",
  ],
  acoes: [
    {
      id: "enviar",
      titulo: "Enviar para aprovação",
      objetivo: "Mandar a carta pronta para o Aprovador Central conferir e publicar.",
      video: "/videos/gerente-enviar-para-aprovacao.webm",
      passos: [
        {
          titulo: "Abra a carta",
          texto: "Em Serviços, clique na carta. Se ela ainda não foi publicada, o alto da página mostra \"Carta pronta para enviar para aprovação\".",
          print: "enviar-1-carta.png",
          gif: "gerente-enviar-para-aprovacao-1.gif",
          onde: "Carta de Serviços › Serviços › carta escolhida",
          tipo: "area",
          recorte: "tela",
        },
        {
          titulo: "Clique em Enviar para aprovação",
          texto: "O botão fica no quadro do alto da carta.",
          print: "enviar-2-botao.png",
          gif: "gerente-enviar-para-aprovacao-2.gif",
          onde: "Carta › quadro no alto",
          tipo: "acao",
          recorte: "elemento",
        },
        {
          titulo: "Escreva a justificativa e envie",
          texto: "Conte em uma frase o que é a carta ou o que mudou (mínimo de 10 letras). O aprovador lê isso primeiro. Depois, clique em Enviar.",
          print: "enviar-3-justificativa.png",
          gif: "gerente-enviar-para-aprovacao-3.gif",
          onde: "Janela Enviar para aprovação",
          tipo: "area",
          recorte: "tela",
        },
        {
          titulo: "Confira o protocolo",
          texto: "O quadro fica \"Aguardando análise\" e mostra o número do pedido. Enquanto o pedido estiver aberto, a carta não recebe outro envio.",
          print: "enviar-4-aguardando.png",
          gif: "gerente-enviar-para-aprovacao-4.gif",
          onde: "Carta › quadro no alto",
          tipo: "atencao",
          recorte: "elemento",
        },
      ],
    },
    {
      id: "acompanhar",
      titulo: "Acompanhar o pedido",
      objetivo: "Ver em que pé está cada carta enviada.",
      passos: [
        {
          titulo: "Abra Aprovações",
          texto: "É o terceiro ícone da barra escura, à esquerda. As abas separam os pedidos: Aguardando análise, Devolvidos para correção, Aprovados e Cancelados.",
          print: "acompanhar-1-fila.png",
          onde: "Barra à esquerda › Aprovações",
          tipo: "area",
          recorte: "tela",
        },
        {
          titulo: "Abra o pedido",
          texto: "Clique na linha da carta para ver o protocolo, a situação e a justificativa. Quem aprova ou devolve é o Aprovador Central.",
          print: "",
        },
      ],
    },
    {
      id: "corrigir-devolvida",
      titulo: "Corrigir e reenviar uma carta devolvida",
      objetivo: "Ajustar o que o Aprovador Central apontou e mandar de novo.",
      passos: [
        { titulo: "Abra Devolvidos para correção", texto: "Em Aprovações, abra a aba e clique no pedido. O motivo aparece campo a campo." },
        { titulo: "Corrija a carta", texto: "Mude só o que foi pedido e salve (✓). Se quem escreve é o Coordenador, repasse os apontamentos para ele." },
        { titulo: "Reenvie", texto: "Na carta, clique em Enviar para aprovação e conte na justificativa o que foi corrigido." },
      ],
    },
    {
      id: "cancelar",
      titulo: "Cancelar o envio",
      objetivo: "Tirar o pedido da fila, por exemplo quando falta corrigir algo.",
      passos: [
        {
          titulo: "Clique em Cancelar solicitação",
          texto: "Na carta que está Aguardando análise, o botão fica no quadro do alto.",
          print: "cancelar-1-botao.png",
          onde: "Carta › quadro no alto",
          tipo: "acao",
          recorte: "elemento",
        },
        {
          titulo: "Escreva o motivo e confirme",
          texto: "O motivo fica registrado para o aprovador. A carta volta a ser rascunho e pode ser enviada de novo.",
          print: "cancelar-2-motivo.png",
          onde: "Janela Cancelar solicitação",
          tipo: "area",
          recorte: "tela",
        },
      ],
    },
    {
      id: "mudar-publicada",
      titulo: "Mudar uma carta publicada",
      objetivo: "Corrigir uma carta que já está no portal, sem tirar a versão atual do ar.",
      aviso: "A carta publicada não se edita direto. A mudança é feita na versão Rascunho e só vai ao portal depois de aprovada. O botão Inativar não serve para mudar: ele pede ao Aprovador Central para tirar a carta do portal.",
      passos: [
        {
          titulo: "Abra a versão Rascunho",
          texto: "Clique no nome da versão (Main), ao lado de Serviços, no alto da página, e escolha Rascunho.",
          print: "mudar-1-versoes.png",
          onde: "Carta › nome da versão, no alto",
          tipo: "acao",
          recorte: "elemento",
        },
        {
          titulo: "Edite, salve e envie",
          texto: "Mude os campos e salve (✓). O quadro do alto mostra \"Versão Rascunho pronta para enviar\": clique em Enviar para aprovação.",
          print: "mudar-2-enviar.png",
          onde: "Carta › versão Rascunho",
          tipo: "acao",
          recorte: "elemento",
        },
      ],
    },
    {
      id: "unidades",
      titulo: "Cuidar das unidades e do órgão",
      objetivo: "Manter endereço, contato e horário de cada local de atendimento.",
      passos: [
        {
          titulo: "Abra Unidades",
          texto: "A lista mostra as unidades do seu órgão. Clique na unidade para abrir.",
          print: "unidades-1-lista.png",
          onde: "Carta de Serviços › Unidades",
          tipo: "acao",
          recorte: "secao",
        },
        {
          titulo: "Atualize as abas e salve",
          texto: "Confira Identificação, Endereço, Contato e Horários. Salve no ✓, no alto à direita.",
          print: "unidades-2-abas.png",
          onde: "Unidades › unidade escolhida",
          tipo: "area",
          recorte: "tela",
        },
        {
          titulo: "Dados do órgão",
          texto: "Em Órgãos, abra o seu órgão para conferir a sigla, o nome e o site. A aba Vínculos mostra as unidades e a sede.",
          print: "unidades-3-orgao.png",
          onde: "Carta de Serviços › Órgãos",
          tipo: "area",
          recorte: "tela",
        },
      ],
    },
  ],
};
