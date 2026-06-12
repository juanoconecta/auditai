const plans = [
  {
    name: "Gratis",
    price: "$0",
    period: "para siempre",
    features: [
      "1 auditoría por mes",
      "Score general",
      "3 recomendaciones",
      "Sin descarga PDF",
    ],
    cta: "Empezar gratis",
    popular: false,
    ctaStyle: "secondary",
  },
  {
    name: "Por informe",
    price: "$9",
    period: "por auditoría",
    features: [
      "Todo lo del plan Gratis",
      "Informe completo con FODA",
      "Benchmark vs industria",
      "Descarga PDF con tu marca",
      "Proyección a 90 días",
    ],
    cta: "Comprar informe",
    popular: true,
    ctaStyle: "primary",
  },
  {
    name: "Pro",
    price: "$19",
    period: "por mes",
    features: [
      "Todo lo anterior, más:",
      "Auditorías ilimitadas",
      "Historial y comparativas",
      "Soporte prioritario",
      "API access",
    ],
    cta: "Empezar Pro",
    popular: false,
    ctaStyle: "secondary",
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#1A1A2E" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
          >
            Precios simples y transparentes
          </h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
            Empezá gratis. Pagás solo cuando querés más.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col p-8"
              style={{
                background: plan.popular ? "#2D2D44" : "rgba(45,45,68,0.5)",
                borderRadius: "14px",
                border: plan.popular
                  ? "1.5px solid #FF6B6B"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full"
                  style={{
                    background: "#FF6B6B",
                    color: "#1A1A2E",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Más popular
                </div>
              )}

              <div
                className="text-sm font-bold mb-2"
                style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
              >
                {plan.name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span
                  className="text-4xl font-bold"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
                >
                  {plan.price}
                </span>
              </div>
              <div
                className="text-sm mb-8"
                style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.35)" }}
              >
                {plan.period}
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: i === 0 && plan.name === "Pro"
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.7)",
                      fontStyle: i === 0 && plan.name === "Pro" ? "italic" : "normal",
                    }}
                  >
                    {!(i === 0 && plan.name === "Pro") && (
                      <span style={{ color: "#4ECDC4", marginTop: "1px" }}>✓</span>
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3.5 text-sm font-bold rounded-lg transition-opacity hover:opacity-90"
                style={
                  plan.ctaStyle === "primary"
                    ? { background: "#FF6B6B", color: "#1A1A2E", borderRadius: "8px", fontFamily: "DM Sans, sans-serif" }
                    : { background: "transparent", color: "#4ECDC4", borderRadius: "8px", border: "1.5px solid #4ECDC4", fontFamily: "DM Sans, sans-serif" }
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
