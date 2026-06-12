"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import InformePDF from "@/components/InformePDF";
import type { InformeAuditoria } from "@/types/informe";

function scoreColor(score: number) {
  if (score >= 70) return "#4ECDC4";
  if (score >= 40) return "#FFE66D";
  return "#FF6B6B";
}

function ScoreCircle({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif", color }}>{score}</span>
        <span className="text-xs" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ fontFamily: "Space Grotesk, sans-serif", color }}>{score}</span>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`} style={{ background: "#2D2D44", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}>
      {children}
    </h2>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontFamily: "JetBrains Mono, monospace" }}>
      {label}
    </span>
  );
}

const prioridadColor: Record<string, string> = {
  alta: "#FF6B6B",
  media: "#FFE66D",
  baja: "#4ECDC4",
};

export default function InformeClient() {
  const router = useRouter();
  const [informe, setInforme] = useState<InformeAuditoria | null>(null);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("auditai_informe");
    if (!raw) { router.push("/"); return; }
    try { setInforme(JSON.parse(raw)); } catch { router.push("/"); }
  }, [router]);

  async function descargarPDF() {
    if (!informe) return;
    setGenerandoPDF(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("auditai-pdf");
      if (!element) return;
      await html2pdf()
        .set({
          margin: 0,
          filename: `AuditAI-${informe.perfil.replace("@", "")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#1A1A2E" },
          jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css"] },
        })
        .from(element)
        .save();
    } finally {
      setGenerandoPDF(false);
    }
  }

  if (!informe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1A1A2E" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>Cargando informe...</span>
      </div>
    );
  }

  const redLabel = { instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn" }[informe.redSocial] ?? informe.redSocial;

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: "#1A1A2E" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Logo size="sm" />
          <button
            onClick={() => router.push("/")}
            className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}
          >
            ← Inicio
          </button>
        </div>

        {/* Hero del informe */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ScoreCircle score={informe.scoreGeneral} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                <Badge label={redLabel} color="#4ECDC4" />
                <Badge label={informe.nivelGeneral} color={scoreColor(informe.scoreGeneral)} />
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}>
                {informe.perfil}
              </h1>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)" }}>
                {informe.resumenEjecutivo}
              </p>
            </div>
          </div>
        </Card>

        {/* Score por categoría */}
        <Card className="mb-6">
          <SectionTitle>📊 Score por categoría</SectionTitle>
          <div className="flex flex-col gap-5">
            {informe.categorias.map((cat) => (
              <div key={cat.nombre}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.8)" }}>{cat.nombre}</span>
                </div>
                <ScoreBar score={cat.score} />
                <p className="text-xs mt-1.5" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>{cat.descripcion}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Benchmark */}
        <Card className="mb-6">
          <SectionTitle>🏆 Benchmark vs industria</SectionTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Space Grotesk, sans-serif", color: scoreColor(informe.scoreGeneral) }}>
                {informe.scoreGeneral}
              </div>
              <div className="text-xs" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>Tu score</div>
            </div>
            <div className="flex-1 p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Space Grotesk, sans-serif", color: "rgba(255,255,255,0.6)" }}>
                {informe.benchmark.promedioIndustria}
              </div>
              <div className="text-xs" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>Promedio {informe.benchmark.industria}</div>
            </div>
            <div className="flex-1 p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Badge label={informe.benchmark.posicion} color={scoreColor(informe.scoreGeneral)} />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.55)" }}>
            {informe.benchmark.descripcion}
          </p>
        </Card>

        {/* FODA */}
        <Card className="mb-6">
          <SectionTitle>🔍 Análisis FODA</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Fortalezas", items: informe.foda.fortalezas, color: "#4ECDC4", icon: "✦" },
              { label: "Oportunidades", items: informe.foda.oportunidades, color: "#FFE66D", icon: "→" },
              { label: "Debilidades", items: informe.foda.debilidades, color: "#FF6B6B", icon: "⚠" },
              { label: "Amenazas", items: informe.foda.amenazas, color: "#FF6B6B", icon: "!" },
            ].map((cuad) => (
              <div key={cuad.label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: cuad.color }}>
                  {cuad.icon} {cuad.label}
                </div>
                <ul className="flex flex-col gap-2">
                  {cuad.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.65)" }}>
                      <span style={{ color: cuad.color, flexShrink: 0 }}>·</span>
                      {item.texto}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Cliente ideal */}
        <Card className="mb-6">
          <SectionTitle>🎯 Cliente ideal</SectionTitle>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>Edad: </span>
              <span style={{ color: "#FFFFFF", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>{informe.clienteIdeal.edad}</span>
            </div>
            <div className="px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>Género: </span>
              <span style={{ color: "#FFFFFF", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>{informe.clienteIdeal.genero}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {informe.clienteIdeal.intereses.map((interes) => (
              <Badge key={interes} label={interes} color="#4ECDC4" />
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)" }}>
            {informe.clienteIdeal.descripcion}
          </p>
        </Card>

        {/* Recomendaciones */}
        <Card className="mb-6">
          <SectionTitle>💡 Recomendaciones</SectionTitle>
          <div className="flex flex-col gap-4">
            {informe.recomendaciones.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${prioridadColor[rec.prioridad]}20` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-sm font-bold" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}>{rec.titulo}</span>
                  <Badge label={rec.prioridad} color={prioridadColor[rec.prioridad]} />
                </div>
                <p className="text-sm mb-2 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.6)" }}>{rec.descripcion}</p>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#4ECDC4", fontSize: "14px" }}>↑</span>
                  <span className="text-xs font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "#4ECDC4" }}>{rec.impacto}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Proyección 90 días */}
        <Card className="mb-10">
          <SectionTitle>📈 Proyección a 90 días</SectionTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            {informe.proyeccion90dias.map((mes, i) => (
              <div key={i} className="flex-1 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-xs font-bold mb-2" style={{ fontFamily: "JetBrains Mono, monospace", color: "#FFE66D" }}>{mes.mes}</div>
                <p className="text-sm mb-3 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.65)" }}>{mes.descripcion}</p>
                <div className="text-xs font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "#4ECDC4" }}>→ {mes.metrica}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA descargar */}
        <div className="text-center">
          <button
            onClick={descargarPDF}
            disabled={generandoPDF}
            className="px-8 py-4 text-base font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "#FF6B6B", color: "#1A1A2E", borderRadius: "10px", fontFamily: "DM Sans, sans-serif" }}
          >
            {generandoPDF ? "Generando PDF..." : "Descargar PDF →"}
          </button>
        </div>

        {/* Componente PDF oculto que se usa para generar el archivo */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <InformePDF informe={informe} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.2)" }}>
            Powered by JuanoConecta · auditai.app
          </p>
        </div>

      </div>
    </div>
  );
}
