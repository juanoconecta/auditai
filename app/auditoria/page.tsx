import { Suspense } from "react";
import AuditoriaClient from "./AuditoriaClient";

export default function AuditoriaPage() {
  return (
    <Suspense>
      <AuditoriaClient />
    </Suspense>
  );
}
