"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#2D2D44",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#FFFFFF",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "14px",
    outline: "none",
  } as React.CSSProperties;

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#1A1A2E" }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Revisá tu email</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}>
            Te enviamos un link de confirmación a <strong style={{ color: "#FFFFFF" }}>{email}</strong>. Hacé click en el link para activar tu cuenta.
          </p>
          <Link href="/login" className="text-sm" style={{ color: "#4ECDC4", fontFamily: "DM Sans, sans-serif" }}>
            Ir al login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#1A1A2E" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <Link href="/"><Logo size="md" /></Link>
          <h1 className="mt-6 text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Creá tu cuenta gratis
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "DM Sans, sans-serif" }}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" style={{ color: "#4ECDC4" }}>Iniciá sesión</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans, sans-serif" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans, sans-serif" }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required style={inputStyle} />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#FF6B6B", fontFamily: "DM Sans, sans-serif" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold rounded-xl mt-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#FF6B6B", color: "#1A1A2E", borderRadius: "10px", fontFamily: "DM Sans, sans-serif" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>

          <p className="text-xs text-center mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans, sans-serif" }}>
            Al registrarte aceptás los términos de uso
          </p>
        </form>
      </div>
    </div>
  );
}
