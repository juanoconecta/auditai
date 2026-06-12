"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import type { FormData } from "@/types/informe";

const redes = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
];

const objetivos = [
  "Conseguir clientes",
  "Crecer seguidores",
  "Vender productos",
  "Posicionarme como experto",
  "Generar comunidad",
  "Otro",
];

export default function AuditoriaClient() {
  const params = useSearchParams();
  const router = useRouter();
  const perfilParam = params.get("perfil") ?? "";

  const [form, setForm] = useState<FormData>({
    perfil: perfilParam,
    redSocial: "instagram",
    nicho: "",
    objetivo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.perfil || !form.nicho || !form.objetivo) {
      setError("Completá todos los campos obligatorios.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      sessionStorage.setItem("auditai_form", JSON.stringify(form));
      router.push(`/auditando?perfil=${encodeURIComponent(form.perfil)}&submit=1`);
    } catch {
      setError("Algo salió mal. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: "#1A1A2E" }}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <Logo size="md" />
          <div className="mt-6 text-center">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
            >
              Contanos sobre tu perfil
            </h1>
            <p className="text-sm" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)" }}>
              Cuanto más contexto nos das, más preciso es el informe
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Red social */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              Red social *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {redes.map((red) => (
                <button
                  key={red.value}
                  type="button"
                  onClick={() => set("redSocial", red.value as FormData["redSocial"])}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                  style={{
                    background: form.redSocial === red.value ? "rgba(255,107,107,0.15)" : "#2D2D44",
                    border: form.redSocial === red.value ? "1.5px solid #FF6B6B" : "1px solid rgba(255,255,255,0.06)",
                    color: form.redSocial === red.value ? "#FF6B6B" : "rgba(255,255,255,0.6)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  <span className="text-2xl">{red.icon}</span>
                  <span className="text-sm font-medium">{red.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              @ o URL del perfil *
            </label>
            <input
              type="text"
              value={form.perfil}
              onChange={(e) => set("perfil", e.target.value)}
              placeholder="@usuario o https://..."
              className="w-full px-4 py-3 text-sm outline-none"
              style={{
                background: "#2D2D44",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontFamily: "DM Sans, sans-serif",
              }}
            />
          </div>

          {/* Nicho */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              Nicho o industria *
            </label>
            <input
              type="text"
              value={form.nicho}
              onChange={(e) => set("nicho", e.target.value)}
              placeholder="ej. Fitness, Moda, Marketing digital, Gastronomía..."
              className="w-full px-4 py-3 text-sm outline-none"
              style={{
                background: "#2D2D44",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontFamily: "DM Sans, sans-serif",
              }}
            />
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              Objetivo principal *
            </label>
            <div className="flex flex-wrap gap-2">
              {objetivos.map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => set("objetivo", obj)}
                  className="px-4 py-2 text-sm rounded-full transition-all"
                  style={{
                    background: form.objetivo === obj ? "rgba(78,205,196,0.15)" : "#2D2D44",
                    border: form.objetivo === obj ? "1.5px solid #4ECDC4" : "1px solid rgba(255,255,255,0.06)",
                    color: form.objetivo === obj ? "#4ECDC4" : "rgba(255,255,255,0.55)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)" }}>
              Contanos sobre tu negocio o perfil{" "}
              <span style={{ color: "rgba(255,255,255,0.35)" }}>(opcional)</span>
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="¿Qué vendés? ¿A quién le hablás? ¿Cuál es tu propuesta de valor?"
              rows={3}
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{
                background: "#2D2D44",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontFamily: "DM Sans, sans-serif",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#FF6B6B", fontFamily: "DM Sans, sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "#FF6B6B",
              color: "#1A1A2E",
              borderRadius: "10px",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {loading ? "Generando..." : "Generar mi informe →"}
          </button>
        </form>
      </div>
    </div>
  );
}
