import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ background: "#1A1A2E", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <Logo size="sm" />
        <p className="text-sm text-white/40" style={{ fontFamily: "DM Sans, sans-serif" }}>
          auditai.app · Powered by JuanoConecta
        </p>
        <p className="text-xs text-white/25" style={{ fontFamily: "DM Sans, sans-serif" }}>
          © {new Date().getFullYear()} AuditAI. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
