// Roda uma jornada pronta no CMS, com legenda por passo e destaque no que vai ser clicado.
//   npm run prints:login                         (uma vez; entre no CMS com o perfil certo)
//   npm run jornada -- criar                     cria uma carta de teste e mostra o id
//   npm run jornada -- enviar 2471               envia a carta 2471 para aprovação
//   npm run jornada -- cancelar 2471             cancela o envio da carta 2471
//   ... --video                                  grava em public/videos/<perfil>-<jornada>.webm
//   ... --limpar                                 roda a limpeza da jornada no fim (ex.: excluir a carta de teste)
// Jornada nova: copie um arquivo de scripts/jornadas/ (formato no topo de cada um).
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { CMS, ESCONDER, abrirMenu, acoes, conectar, legenda } from "./comum.mjs";

const args = process.argv.slice(2);
const nome = args.find((a) => !a.startsWith("--"));
const id = args.filter((a) => !a.startsWith("--"))[1];
const VIDEO = args.includes("--video");
if (!nome || !existsSync(`scripts/jornadas/${nome}.mjs`)) {
  console.error("Uso: npm run jornada -- <criar|enviar|cancelar> [id da carta] [--video] [--limpar]");
  process.exit(1);
}
const j = (await import(`./jornadas/${nome}.mjs`)).default;
if (j.precisaId && !id) {
  console.error(`A jornada "${nome}" precisa do id da carta. Ex.: npm run jornada -- ${nome} 2471`);
  process.exit(1);
}

const browser = await conectar();
const logado = browser.contexts()[0];
// preparar: acerta o estado da carta antes de gravar (fora do vídeo), na sessão do Edge
if (j.preparar) {
  const pg = await logado.newPage();
  await pg.goto(`${CMS}/admin`, { waitUntil: "networkidle" });
  await j.preparar(acoes(pg), id);
  await pg.close();
}

const PASTA = ".auth/video";
rmSync(PASTA, { recursive: true, force: true });
const ctx = VIDEO
  ? await browser.newContext({
      storageState: await logado.storageState(),
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: PASTA, size: { width: 1440, height: 900 } },
    })
  : logado;
const page = await ctx.newPage();
const t0 = Date.now(); // o vídeo começa junto com a página: os tempos dos passos (para o GIF) contam daqui
const seg = () => +((Date.now() - t0) / 1000).toFixed(1);
const tempos = [];
await page.setViewportSize({ width: 1440, height: 900 });
await abrirMenu(page);
await page.addInitScript((css) => {
  document.addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
  });
}, ESCONDER);

let n = 0;
const a = acoes(page, () => n);
await page.goto(`${CMS}${j.inicio(id)}`, { waitUntil: "networkidle" });
// a janela de gravação passa pelo SSO (keycloak) antes de mostrar a tela
if (j.esperar) await page.getByText(j.esperar, { exact: false }).first().waitFor({ timeout: 60_000 });
await legenda(page, j.abertura);
await a.pausa(2000);

let falhou = false;
for (const p of j.passos) {
  n += 1;
  const de = seg();
  await legenda(page, `Passo ${n} de ${j.passos.length} · ${p.legenda}`);
  try {
    await p.fazer(a, id);
    tempos.push({ passo: n, legenda: p.legenda, de, ate: seg() });
    console.log(`ok   ${n}. ${p.legenda}`);
  } catch (e) {
    falhou = true;
    console.warn(`erro ${n}. ${p.legenda}: ${e.message.split("\n")[0]}`);
    await page.screenshot({ path: `.auth/erro-${nome}-passo-${n}.png` });
    break;
  }
}
if (!falhou && j.fechamento) {
  await legenda(page, j.fechamento);
  await a.pausa(3500);
}
const resultado = j.resultado ? await j.resultado(a, id) : null;
if (resultado) console.log(resultado);
if (args.includes("--limpar") && j.limpar) console.log(await j.limpar(a, id));

if (VIDEO) {
  const video = page.video();
  // o SSO renova a sessão nesta janela e a do Edge expira: devolve os cookies novos ao Edge
  await logado.addCookies(await ctx.cookies());
  await ctx.close(); // fecha só o contexto da gravação; o Edge continua aberto e logado
  const destino = `public/videos/${j.video}.webm`;
  mkdirSync("public/videos", { recursive: true });
  copyFileSync(await video.path(), destino);
  writeFileSync(`public/videos/${j.video}.passos.json`, JSON.stringify(tempos, null, 1));
  console.log(`vídeo: ${destino} (tempos dos passos em ${j.video}.passos.json; GIF: npm run gif -- ${j.video})`);
} else {
  await page.close();
}
process.exit(falhou ? 1 : 0); // só desconecta: browser.close() fecharia o Edge e o login
