export type Passo = {
  titulo: string;
  texto: string;
  /** arquivo em public/prints/<perfil>/; vazio enquanto o print não foi capturado */
  print?: string;
  /** GIF do trecho deste passo em public/gifs/ (npm run gif). No site, aparece no lugar do print; o PDF continua com o print */
  gif?: string;
  /** caminho no menu do CMS, ex.: "Carta de Serviços › Serviços" */
  onde?: string;
  /** linguagem visual do destaque no print: "acao" = azul com número (botão, menu, link);
   *  "area" = fundo azul claro (formulário, aba, seção); "atencao" = âmbar (aviso, restrição).
   *  Default "acao". */
  tipo?: "acao" | "area" | "atencao";
  /** enquadramento do print: "tela" = 2880x1800 completa (default; use para contexto); "elemento" =
   *  recorte no destaque + margem (botão específico); "secao" = recorte no contêiner pai (formulário). */
  recorte?: "tela" | "elemento" | "secao";
};

export type Acao = {
  id: string;
  titulo: string;
  objetivo: string;
  passos: Passo[];
  /** aviso curto mostrado antes dos passos */
  aviso?: string;
  /** funcionalidade ainda em desenvolvimento no CMS: aparece com selo e sem prints. Tire quando for entregue */
  previsto?: boolean;
  /** vídeo da ação: arquivo em public/ ("/videos/x.webm") ou link do Drive (https://drive.google.com/file/d/<id>/...) */
  video?: string;
};

export type Perfil = {
  id: string;
  nome: string;
  resumo: string;
  /** "pronto" aparece com link; "em-preparacao" só como card informativo */
  situacao: "pronto" | "em-preparacao";
  pode?: string[];
  naoPode?: string[];
  acoes?: Acao[];
};
