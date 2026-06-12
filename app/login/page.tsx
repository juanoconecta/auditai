"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#1A1A2E" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <Link href="/"><Logo size="md" /></Link>
          <h1 className="mt-6 text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Iniciá sesión
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "DM Sans, sans-serif" }}>
            ¿No tenés cuenta?{" "}
            <Link href="/registro" style={{ color: "#4ECDC4" }}>Registrate gratis</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans, sans-serif" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans, sans-serif" }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
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
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
