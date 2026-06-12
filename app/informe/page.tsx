import { Suspense } from "react";
import InformeClient from "./InformeClient";

export default function InformePage() {
  return (
    <Suspense>
      <InformeClient />
    </Suspense>
  );
}
