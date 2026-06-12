import type { InformeAuditoria } from "@/types/informe";

function scoreColor(score: number) {
  if (score >= 70) return "#4ECDC4";
  if (score >= 40) return "#FFE66D";
  return "#FF6B6B";
}

const prioridadColor: Record<string, string> = {
  alta: "#FF6B6B",
  media: "#FFE66D",
  baja: "#4ECDC4",
};

const S = {
  page: {
    width: "794px",
    background: "#1A1A2E",
    color: "#FFFFFF",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "12px",
    lineHeight: "1.5",
    padding: "40px 44px",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    marginBottom: "12px",
    marginTop: "24px",
    color: "#FFFFFF",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: "6px",
  } as React.CSSProperties,
  card: {
    background: "#2D2D44",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "8px",
  } as React.CSSProperties,
};

export default function InformePDF({ informe }: { informe: InformeAuditoria }) {
  const redLabel = { instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn" }[informe.redSocial] ?? informe.redSocial;
  const color = scoreColor(informe.scoreGeneral);
  const fecha = new Date(informe.fechaGeneracion).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div id="auditai-pdf" style={S.page}>

      {/* ENCABEZADO */}
      <div style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", paddingBottom: "20px", marginBottom: "4px" }}>
        <div style={{ display: "table", width: "100%" }}>
          <div style={{ display: "table-cell", verticalAlign: "middle" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>
              <span style={{ color: "#FFFFFF" }}>Audit</span><span style={{ color: "#FFE66D" }}>AI</span>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>auditai.app · Informe de auditoría</div>
          </div>
          <div style={{ display: "table-cell", verticalAlign: "middle", textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{fecha}</div>
          </div>
        </div>
      </div>

      {/* RESUMEN EJECUTIVO */}
      <div style={{ background: "#2D2D44", borderRadius: "10px", padding: "18px 20px", marginTop: "16px", marginBottom: "4px" }}>
        <div style={{ display: "table", width: "100%" }}>
          <div style={{ display: "table-cell", verticalAlign: "top", width: "110px" }}>
            <div style={{ fontSize: "48px", fontWeight: "bold", color, lineHeight: "1", textAlign: "center" }}>{informe.scoreGeneral}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "2px" }}>/100</div>
            <div style={{ fontSize: "10px", fontWeight: "bold", color, textAlign: "center", marginTop: "6px", background: `${color}20`, borderRadius: "4px", padding: "2px 4px" }}>{informe.nivelGeneral}</div>
          </div>
          <div style={{ display: "table-cell", verticalAlign: "top", paddingLeft: "20px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>{informe.perfil}</div>
            <div style={{ fontSize: "11px", color: "#4ECDC4", marginBottom: "10px" }}>{redLabel} · {informe.benchmark.industria}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>{informe.resumenEjecutivo}</div>
          </div>
        </div>
      </div>

      {/* SCORES POR CATEGORÍA */}
      <div style={S.sectionTitle}>📊 Score por categoría</div>
      <div style={{ display: "table", width: "100%", borderSpacing: "6px", marginTop: "-6px" }}>
        <div style={{ display: "table-row" }}>
          {informe.categorias.slice(0, 3).map((cat) => {
            const c = scoreColor(cat.score);
            return (
              <div key={cat.nombre} style={{ display: "table-cell", background: "#2D2D44", borderRadius: "8px", padding: "10px 12px", width: "33%" }}>
                <div style={{ display: "table", width: "100%", marginBottom: "6px" }}>
                  <div style={{ display: "table-cell", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{cat.nombre}</div>
                  <div style={{ display: "table-cell", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: c }}>{cat.score}</div>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px" }}>
                  <div style={{ height: "5px", width: `${cat.score}%`, background: c, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>{cat.descripcion}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "table", width: "100%", borderSpacing: "6px", marginTop: "0px" }}>
        <div style={{ display: "table-row" }}>
          {informe.categorias.slice(3, 6).map((cat) => {
            const c = scoreColor(cat.score);
            return (
              <div key={cat.nombre} style={{ display: "table-cell", background: "#2D2D44", borderRadius: "8px", padding: "10px 12px", width: "33%" }}>
                <div style={{ display: "table", width: "100%", marginBottom: "6px" }}>
                  <div style={{ display: "table-cell", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>{cat.nombre}</div>
                  <div style={{ display: "table-cell", textAlign: "right", fontSize: "13px", fontWeight: "bold", color: c }}>{cat.score}</div>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px" }}>
                  <div style={{ height: "5px", width: `${cat.score}%`, background: c, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>{cat.descripcion}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BENCHMARK */}
      <div style={S.sectionTitle}>🏆 Benchmark vs industria</div>
      <div style={{ background: "#2D2D44", borderRadius: "8px", padding: "14px" }}>
        <div style={{ display: "table", width: "100%", marginBottom: "10px" }}>
          <div style={{ display: "table-cell", textAlign: "center", width: "33%", padding: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "6px" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color }}>{informe.scoreGeneral}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Tu score</div>
          </div>
          <div style={{ display: "table-cell", width: "4px" }} />
          <div style={{ display: "table-cell", textAlign: "center", width: "33%", padding: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "6px" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "rgba(255,255,255,0.5)" }}>{informe.benchmark.promedioIndustria}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Promedio industria</div>
          </div>
          <div style={{ display: "table-cell", width: "4px" }} />
          <div style={{ display: "table-cell", textAlign: "center", width: "33%", padding: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", verticalAlign: "middle" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color, background: `${color}20`, padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>{informe.benchmark.posicion}</div>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{informe.benchmark.descripcion}</div>
      </div>

      {/* FODA */}
      <div style={S.sectionTitle}>🔍 Análisis FODA</div>
      <div style={{ display: "table", width: "100%", borderSpacing: "6px" }}>
        {[
          [{ label: "Fortalezas", items: informe.foda.fortalezas, c: "#4ECDC4" }, { label: "Oportunidades", items: informe.foda.oportunidades, c: "#FFE66D" }],
          [{ label: "Debilidades", items: informe.foda.debilidades, c: "#FF6B6B" }, { label: "Amenazas", items: informe.foda.amenazas, c: "#FF6B6B" }],
        ].map((row, ri) => (
          <div key={ri} style={{ display: "table-row" }}>
            {row.map((cuad) => (
              <div key={cuad.label} style={{ display: "table-cell", background: "#2D2D44", borderRadius: "8px", padding: "12px", width: "50%", verticalAlign: "top" }}>
                <div style={{ fontSize: "10px", fontWeight: "bold", color: cuad.c, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cuad.label}</div>
                {cuad.items.map((item, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginBottom: "5px", paddingLeft: "10px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: cuad.c }}>·</span>
                    {item.texto}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CLIENTE IDEAL */}
      <div style={S.sectionTitle}>🎯 Cliente ideal</div>
      <div style={{ background: "#2D2D44", borderRadius: "8px", padding: "14px" }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", marginRight: "8px" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Edad: </span>
            <span style={{ fontWeight: "bold" }}>{informe.clienteIdeal.edad}</span>
          </span>
          <span style={{ background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Género: </span>
            <span style={{ fontWeight: "bold" }}>{informe.clienteIdeal.genero}</span>
          </span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          {informe.clienteIdeal.intereses.map((int) => (
            <span key={int} style={{ display: "inline-block", background: "rgba(78,205,196,0.12)", color: "#4ECDC4", fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "10px", marginRight: "6px", marginBottom: "4px" }}>{int}</span>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{informe.clienteIdeal.descripcion}</div>
      </div>

      {/* RECOMENDACIONES */}
      <div style={S.sectionTitle}>💡 Recomendaciones</div>
      {informe.recomendaciones.map((rec, i) => {
        const pc = prioridadColor[rec.prioridad];
        return (
          <div key={i} style={{ background: "#2D2D44", borderRadius: "8px", padding: "12px 14px", marginBottom: "7px", borderLeft: `3px solid ${pc}` }}>
            <div style={{ display: "table", width: "100%", marginBottom: "5px" }}>
              <div style={{ display: "table-cell", fontSize: "12px", fontWeight: "bold" }}>{rec.titulo}</div>
              <div style={{ display: "table-cell", textAlign: "right", fontSize: "10px", fontWeight: "bold", color: pc, background: `${pc}20`, padding: "2px 8px", borderRadius: "4px", whiteSpace: "nowrap" as const }}>{rec.prioridad}</div>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginBottom: "5px" }}>{rec.descripcion}</div>
            <div style={{ fontSize: "11px", color: "#4ECDC4", fontWeight: "bold" }}>↑ {rec.impacto}</div>
          </div>
        );
      })}

      {/* PROYECCIÓN */}
      <div style={S.sectionTitle}>📈 Proyección a 90 días</div>
      <div style={{ display: "table", width: "100%", borderSpacing: "6px" }}>
        <div style={{ display: "table-row" }}>
          {informe.proyeccion90dias.map((mes, i) => (
            <div key={i} style={{ display: "table-cell", background: "#2D2D44", borderRadius: "8px", padding: "12px", width: "33%", verticalAlign: "top" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#FFE66D", marginBottom: "6px" }}>{mes.mes}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginBottom: "6px", lineHeight: "1.5" }}>{mes.descripcion}</div>
              <div style={{ fontSize: "11px", color: "#4ECDC4", fontWeight: "bold" }}>→ {mes.metrica}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "28px", paddingTop: "14px", display: "table", width: "100%" }}>
        <div style={{ display: "table-cell" }}>
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            <span style={{ color: "#FFFFFF" }}>Audit</span><span style={{ color: "#FFE66D" }}>AI</span>
          </span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginLeft: "8px" }}>auditai.app</span>
        </div>
        <div style={{ display: "table-cell", textAlign: "right", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Powered by JuanoConecta</div>
      </div>

    </div>
  );
}
