"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: "rgba(26,26,46,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <Link href="/" className="flex items-center">
        <Logo size="md" />
      </Link>

      <div className="flex items-center gap-4">
        {loggedIn ? (
          <Link
            href="/dashboard"
            className="text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#FF6B6B", color: "#1A1A2E", borderRadius: "8px", fontFamily: "DM Sans, sans-serif" }}
          >
            Mis auditorías
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#FF6B6B", color: "#1A1A2E", borderRadius: "8px", fontFamily: "DM Sans, sans-serif" }}
            >
              Empezar gratis
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
