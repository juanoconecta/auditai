const steps = [
  {
    number: "01",
    icon: "🔗",
    title: "Ingresá el perfil",
    desc: "Pegá el @ o URL de Instagram, TikTok o LinkedIn.",
  },
  {
    number: "02",
    icon: "🤖",
    title: "La IA analiza",
    desc: "Claude analiza más de 6 métricas clave en segundos.",
  },
  {
    number: "03",
    icon: "📊",
    title: "Recibís el informe",
    desc: "Score por categoría, FODA y recomendaciones accionables.",
  },
  {
    number: "04",
    icon: "📄",
    title: "Descargá el PDF",
    desc: "Informe profesional con tu marca listo para compartir.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#1A1A2E" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
          >
            ¿Cómo funciona?
          </h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
            Cuatro pasos simples para obtener tu auditoría profesional
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col p-6"
              style={{
                background: "#2D2D44",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                className="text-xs font-bold mb-4"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#4ECDC4" }}
              >
                {step.number}
              </span>
              <span className="text-3xl mb-4">{step.icon}</span>
              <h3
                className="text-base font-bold mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
