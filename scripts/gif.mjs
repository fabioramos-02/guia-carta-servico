// Recorta o trecho de cada passo do vídeo da jornada e salva como GIF, para o site (o PDF continua com o print).
//   npm run gif -- gerente-enviar-para-aprovacao          → public/gifs/gerente-enviar-para-aprovacao-<passo>.gif
//   npm run gif -- gerente-enviar-para-aprovacao 2 3      só os passos 2 e 3
// Os tempos vêm de public/videos/<video>.passos.json, que o `npm run jornada -- ... --video` grava sozinho.
// Vídeo antigo sem o arquivo: escreva-o à mão, [{ "passo": 1, "de": 3.0, "ate": 7.5 }, ...] (segundos).
// Usa o ffmpeg que vem com o Playwright (tira os quadros) e o Python com Pillow (monta o GIF).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const QUADROS_POR_SEG = Number(process.env.GIF_QPS ?? 6); // 6 qps e 960 px deixam o GIF leve; passo longo (> 20 s): GIF_QPS=3
const LARGURA = 960;

const [nome, ...so] = process.argv.slice(2);
const video = `public/videos/${nome}.webm`;
const arqTempos = `public/videos/${nome}.passos.json`;
if (!nome || !existsSync(video) || !existsSync(arqTempos)) {
  console.error(`Uso: npm run gif -- <video> [passos]. Precisa de ${video} e ${arqTempos}.`);
  process.exit(1);
}

// o ffmpeg mais novo do Playwright (o antigo, ffmpeg-1011, não lê o VP9 dos vídeos gravados)
const ffmpeg = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(process.env.LOCALAPPDATA ?? "", "ms-playwright")]
  .filter((p) => p && existsSync(p))
  .flatMap((p) => readdirSync(p).filter((d) => d.startsWith("ffmpeg-")).map((d) => join(p, d)))
  .sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop()))
  .map((d) => join(d, readdirSync(d).find((f) => f.startsWith("ffmpeg")) ?? ""))[0];
if (!ffmpeg || !existsSync(ffmpeg)) {
  console.error("ffmpeg do Playwright não encontrado. Rode: npx playwright install ffmpeg");
  process.exit(1);
}

const tempos = JSON.parse(readFileSync(arqTempos, "utf8")).filter((t) => !so.length || so.includes(String(t.passo)));
mkdirSync("public/gifs", { recursive: true });
for (const t of tempos) {
  const pasta = join(".auth", "gif", `${nome}-${t.passo}`);
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  execFileSync(ffmpeg, [
    "-hide_banner", "-loglevel", "error", "-ss", String(t.de), "-to", String(t.ate),
    "-i", video, "-r", String(QUADROS_POR_SEG), join(pasta, "%04d.png"), // ffmpeg do Playwright não tem o filtro fps
  ]);
  const saida = `public/gifs/${nome}-${t.passo}.gif`;
  execFileSync("python", ["-I", "scripts/montar_gif.py", pasta, saida, String(LARGURA), String(Math.round(1000 / QUADROS_POR_SEG))], { stdio: "inherit" });
}
