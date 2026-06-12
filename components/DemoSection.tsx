const categories = [
  { label: "Bio & Presentación", score: 72, color: "#4ECDC4" },
  { label: "Estética visual", score: 55, color: "#FFE66D" },
  { label: "Estrategia de contenido", score: 48, color: "#FFE66D" },
  { label: "Engagement", score: 61, color: "#FFE66D" },
  { label: "Claridad comercial", score: 40, color: "#FFE66D" },
  { label: "Crecimiento", score: 35, color: "#FF6B6B" },
];

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="text-sm font-bold w-8 text-right"
        style={{ fontFamily: "Space Grotesk, sans-serif", color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function DemoSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#2D2D44" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
          >
            Así se ve el informe
          </h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
            Ejemplo real de auditoría para @cocacola
          </p>
        </div>

        <div
          className="max-w-2xl mx-auto p-8"
          style={{ background: "#1A1A2E", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Header mockup */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div
                className="text-sm font-bold mb-1"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#4ECDC4" }}
              >
                Instagram · @cocacola
              </div>
              <div
                className="text-lg font-bold"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
              >
                Coca-Cola
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="text-5xl font-bold"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFE66D" }}
              >
                58
              </div>
              <div
                className="text-xs mt-1"
                style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}
              >
                Score general /100
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div
                  className="text-sm mb-1.5"
                  style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}
                >
                  {cat.label}
                </div>
                <ScoreBar score={cat.score} color={cat.color} />
              </div>
            ))}
          </div>

          {/* FODA snippet */}
          <div
            className="mt-8 p-5 rounded-xl"
            style={{ background: "#2D2D44", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="text-xs font-bold mb-3 uppercase tracking-wider"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "#4ECDC4" }}
            >
              FODA · Fortalezas
            </div>
            <ul className="flex flex-col gap-2">
              {[
                "Alta reconocibilidad de marca y consistencia visual",
                "Frecuencia de publicación óptima (1,2 posts/día)",
                "Fuerte presencia en hashtags de nicho",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.65)" }}
                >
                  <span style={{ color: "#4ECDC4" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-center">
            <span
              className="text-xs"
              style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.3)" }}
            >
              Vista previa — el informe completo incluye 8 secciones y descarga en PDF
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
