"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const steps = [
  "Detectando red social y verificando perfil",
  "Analizando bio, foto de perfil y highlights",
  "Evaluando estética visual y coherencia de feed",
  "Calculando métricas de engagement",
  "Comparando con benchmarks de la industria",
  "Generando FODA y cliente ideal",
  "Calculando proyección a 90 días",
  "Preparando tu informe profesional",
];

export default function AuditandoClient() {
  const params = useSearchParams();
  const router = useRouter();
  const perfil = params.get("perfil") ?? "@usuario";
  const shouldSubmit = params.get("submit") === "1";
  const ref = params.get("ref");

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const called = useRef(false);

  // Advance steps visually
  useEffect(() => {
    if (currentStep >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, 900);
    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    setProgress(Math.round(((currentStep + 1) / steps.length) * 100));
  }, [currentStep]);

  // Call API if coming from form (flujo legado sin pago)
  useEffect(() => {
    if (!shouldSubmit || called.current) return;
    called.current = true;

    const formData = sessionStorage.getItem("auditai_form");
    if (!formData) {
      router.push("/auditoria");
      return;
    }

    fetch("/api/auditar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData,
    })
      .then((r) => r.json())
      .then((informe) => {
        if (informe.error) throw new Error(informe.error);
        sessionStorage.setItem("auditai_informe", JSON.stringify(informe));
        sessionStorage.removeItem("auditai_form");
        // Finish animation then redirect
        setTimeout(() => router.push("/informe"), 1200);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(err);
        setError(`Error: ${msg}`);
      });
  }, [shouldSubmit, router]);

  // Esperar confirmación del pago y generar el informe
  useEffect(() => {
    if (!ref || called.current) return;
    called.current = true;

    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      attempts++;
      try {
        const r = await fetch(`/api/pago/estado?ref=${ref}`);
        const data = await r.json();

        if (data.status === "approved") {
          const res = await fetch("/api/auditar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ref }),
          });
          const informe = await res.json();
          if (informe.error) throw new Error(informe.error);
          sessionStorage.setItem("auditai_informe", JSON.stringify(informe));
          setTimeout(() => router.push("/informe"), 1200);
          return;
        }

        if (data.status === "rejected" || data.status === "cancelled") {
          throw new Error("El pago fue rechazado.");
        }

        if (attempts >= maxAttempts) {
          throw new Error("El pago está demorando en confirmarse. Probá de nuevo en unos minutos.");
        }

        setTimeout(poll, 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(err);
        setError(`Error: ${msg}`);
      }
    };

    poll();
  }, [ref, router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#1A1A2E" }}
    >
      <div className="mb-12">
        <Logo size="lg" />
      </div>

      <div className="w-full max-w-lg">
        {/* Profile chip */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-10"
          style={{
            background: "rgba(78,205,196,0.12)",
            border: "1px solid rgba(78,205,196,0.25)",
            color: "#4ECDC4",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span>⬡</span>
          <span>{perfil}</span>
        </div>

        <h1
          className="text-3xl font-bold mb-10"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#FFFFFF" }}
        >
          Analizando tu perfil...
        </h1>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-10">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background: isDone ? "#4ECDC4" : isActive ? "rgba(255,230,109,0.2)" : "rgba(255,255,255,0.06)",
                    border: isActive ? "1.5px solid #FFE66D" : "none",
                    color: isDone ? "#1A1A2E" : isActive ? "#FFE66D" : "rgba(255,255,255,0.25)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {isDone ? "✓" : isActive ? "●" : "○"}
                </div>
                <span
                  className="text-sm transition-all duration-300"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: isDone ? "rgba(255,255,255,0.5)" : isActive ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #4ECDC4, #FFE66D)" }}
          />
        </div>
        <div className="mt-3 text-right text-sm" style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.4)" }}>
          {progress}%
        </div>

        {error && (
          <div
            className="mt-6 p-4 rounded-xl text-sm"
            style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "#FF6B6B", fontFamily: "DM Sans, sans-serif" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
