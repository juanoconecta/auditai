import { Suspense } from "react";
import AuditandoClient from "./AuditandoClient";

export default function AuditandoPage() {
  return (
    <Suspense>
      <AuditandoClient />
    </Suspense>
  );
}
