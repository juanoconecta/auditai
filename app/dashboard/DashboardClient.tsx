"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Auditoria {
  id: string;
  perfil: string;
  red_social: string;
  score_general: number;
  nivel_general: string;
  created_at: string;
}

function scoreColor(score: number) {
  if (score >= 70) return "#4ECDC4";
  if (score >= 40) return "#FFE66D";
  return "#FF6B6B";
}

const redIcon: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  linkedin: "💼",
};

export default function DashboardClient({ user, auditorias }: { user: User; auditorias: Auditoria[] }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#1A1A2E" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}
            >
              Salir
            </button>
          </div>
        </div>

        {/* Bienvenida */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Mis auditorías
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "DM Sans, sans-serif" }}>
            {auditorias.length === 0
              ? "Todavía no hiciste ninguna auditoría."
              : `${auditorias.length} auditoría${auditorias.length !== 1 ? "s" : ""} realizadas`}
          </p>
        </div>

        {/* CTA nueva auditoría */}
        <Link
          href="/"
          className="flex items-center justify-between p-5 mb-6 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "#FF6B6B", borderRadius: "14px" }}
        >
          <div>
            <div className="text-base font-bold" style={{ color: "#1A1A2E", fontFamily: "Space Grotesk, sans-serif" }}>
              + Nueva auditoría
            </div>
            <div className="text-sm" style={{ color: "rgba(26,26,46,0.7)", fontFamily: "DM Sans, sans-serif" }}>
              Auditá otro perfil de Instagram, TikTok o LinkedIn
            </div>
          </div>
          <span style={{ color: "#1A1A2E", fontSize: "24px" }}>→</span>
        </Link>

        {/* Lista de auditorías */}
        {auditorias.length === 0 ? (
          <div
            className="p-12 text-center rounded-xl"
            style={{ background: "#2D2D44", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <div className="text-4xl mb-4">📊</div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>
              Tus informes van a aparecer acá
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {auditorias.map((a) => {
              const color = scoreColor(a.score_general);
              const fecha = new Date(a.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-5 rounded-xl"
                  style={{ background: "#2D2D44", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{redIcon[a.red_social] ?? "🌐"}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{a.perfil}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "DM Sans, sans-serif" }}>{fecha}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif", color }}>{a.score_general}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "DM Sans, sans-serif" }}>{a.nivel_general}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
