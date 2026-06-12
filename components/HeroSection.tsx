"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [handle, setHandle] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    router.push(`/auditoria?perfil=${encodeURIComponent(handle.trim())}`);
  }

  return (
    <section
      className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-24"
      style={{ background: "linear-gradient(180deg, #1A1A2E 0%, #2D2D44 100%)" }}
    >
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
        style={{ background: "rgba(78,205,196,0.15)", color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.3)" }}
      >
        <span>✦</span>
        <span style={{ fontFamily: "DM Sans, sans-serif" }}>IA entrenada en +10.000 perfiles</span>
      </div>

      {/* Headline */}
      <h1
        className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl"
        style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
      >
        Auditá tu perfil con{" "}
        <span style={{ color: "#FFE66D" }}>IA</span>{" "}
        en 30 segundos
      </h1>

      {/* Subheadline */}
      <p
        className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed"
        style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.65)" }}
      >
        Obtené un informe profesional con score por categoría, benchmark vs industria,
        FODA y recomendaciones con impacto estimado.
      </p>

      {/* Input + CTA */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mb-5">
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@usuario o URL del perfil"
          className="flex-1 px-5 py-4 text-base outline-none"
          style={{
            background: "#2D2D44",
            border: "1.5px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            color: "#FFFFFF",
            fontFamily: "DM Sans, sans-serif",
          }}
        />
        <button
          type="submit"
          className="px-8 py-4 text-base font-bold whitespace-nowrap transition-opacity hover:opacity-90"
          style={{
            background: "#FF6B6B",
            color: "#1A1A2E",
            borderRadius: "8px",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Auditar gratis
        </button>
      </form>

      {/* No card badge */}
      <p className="text-sm mb-12" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>
        ✓ No requiere tarjeta de crédito
      </p>

      {/* Stats */}
      <div className="flex items-center gap-8 md:gap-16">
        {[
          { value: "30", label: "segundos" },
          { value: "3", label: "redes sociales" },
          { value: "6", label: "métricas" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span
              className="text-4xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFE66D" }}
            >
              {stat.value}
            </span>
            <span
              className="text-sm mt-1"
              style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
