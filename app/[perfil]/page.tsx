import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import {
  DsAlert,
  DsBreadcrumb,
  DsCard,
  DsImage,
  DsPageHeader,
  DsSectionHeading,
  DsSteps,
} from "@plataforma-xvia/ds-react/server";
import ambiente from "@/conteudo/ambiente.json";
import { perfilPorId, perfis } from "@/conteudo/perfis";
import { Imprimir } from "../imprimir";
import { Video } from "../video";

const CMS = `${ambiente.url}/admin`;

// endereço que não é perfil (ex.: /favicon.ico) vira 404, em vez de erro no npm run dev com output: export
export const dynamicParams = false;

export const generateStaticParams = () =>
  perfis.filter((p) => p.situacao === "pronto").map((p) => ({ perfil: p.id }));

export default async function PaginaPerfil({ params }: { params: Promise<{ perfil: string }> }) {
  const perfil = perfilPorId((await params).perfil);
  if (!perfil?.acoes) notFound();

  const trilha = [{ label: "Início", href: "/" }, { label: perfil.nome }];

  return (
    <>
      <section className="capa so-pdf" aria-hidden="true">
        <p className="capa__eyebrow">Guia da carta de serviço</p>
        <h1 className="capa__titulo">Perfil {perfil.nome}</h1>
        <p>{perfil.resumo}</p>
        <p>
          CMS ({ambiente.nome}): {CMS}
        </p>
        <p className="muted">
          Secretaria-Executiva de Transformação Digital — SETDIG · gerado em {new Date().toLocaleDateString("pt-BR")}
        </p>
      </section>

      <div className="wrap topo so-tela">
        <DsPageHeader
          heading={`Perfil ${perfil.nome}`}
          description={perfil.resumo}
          eyebrow="Guia da carta de serviço"
        >
          <DsBreadcrumb slot="breadcrumb" items={JSON.stringify(trilha)} />
          <div slot="actions">
            <Imprimir perfil={perfil.id} />
          </div>
        </DsPageHeader>
      </div>

      <div className="wrap section">
        <DsAlert tone="info" heading={`CMS em ${ambiente.nome.toLowerCase()}`}>
          Endereço: <a href={CMS}>{CMS}</a>
        </DsAlert>

        <div className="grid grid--2 resumo">
          <DsCard heading="O que você faz" headingLevel="2" icon="check" tone="success">
            <ul className="lista">{perfil.pode?.map((x) => <li key={x}>{x}</li>)}</ul>
          </DsCard>
          <DsCard heading="O que não é com você" headingLevel="2" icon="close" tone="neutral">
            <ul className="lista">{perfil.naoPode?.map((x) => <li key={x}>{x}</li>)}</ul>
          </DsCard>
        </div>

        <nav className="indice" aria-label="Ações deste perfil">
          <h2>Nesta página</h2>
          <ol className="lista">
            {perfil.acoes.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`}>{a.titulo}</a>
                {a.previsto && <span className="muted"> (em desenvolvimento)</span>}
              </li>
            ))}
          </ol>
        </nav>

        {perfil.acoes.map((acao, i) => (
          <section key={acao.id} id={acao.id} className="acao" aria-labelledby={`t-${acao.id}`}>
            <DsSectionHeading heading={`${i + 1}. ${acao.titulo}`} headingId={`t-${acao.id}`} description={acao.objetivo} />
            {acao.previsto && (
              <DsAlert tone="info" heading="Em desenvolvimento">
                Esta função ainda está sendo feita no CMS. O passo a passo abaixo é o previsto.
              </DsAlert>
            )}
            {acao.aviso && <DsAlert tone="warning">{acao.aviso}</DsAlert>}
            {acao.video && <Video src={acao.video} titulo={`${acao.titulo} (vídeo)`} />}
            <DsSteps headingLevel="3" items={JSON.stringify(acao.passos.map((p) => ({ title: p.titulo })))}>
              {acao.passos.map((p, n) => (
                <div key={n} slot={`description-${n + 1}`} className="passo">
                  <p>{p.texto.replace("{cms}", CMS)}</p>
                  {p.onde && <p className="onde">Onde: {p.onde}</p>}
                  {p.gif && existsSync(join(process.cwd(), "public/gifs", p.gif)) && (
                    // GIF só na tela; o PDF fica com o print logo abaixo
                    <div className={`tela tela--${p.tipo ?? "acao"} so-tela`}>
                      <DsImage src={`/gifs/${p.gif}`} alt={`Animação do CMS: ${p.titulo}`} fit="contain" rounded loading="lazy" />
                    </div>
                  )}
                  {p.print && existsSync(join(process.cwd(), "public/prints", perfil.id, p.print)) ? (
                    <div className={`tela tela--${p.tipo ?? "acao"}${p.gif ? " so-pdf" : ""}`}>
                      <DsImage
                        src={`/prints/${perfil.id}/${p.print}`}
                        alt={`Tela do CMS: ${p.titulo}`}
                        fit="contain"
                        rounded
                        loading="eager"
                      />
                    </div>
                  ) : acao.previsto ? null : (
                    <p className="sem-print so-tela">Print desta etapa em preparação.</p>
                  )}
                </div>
              ))}
            </DsSteps>
          </section>
        ))}
      </div>
    </>
  );
}
