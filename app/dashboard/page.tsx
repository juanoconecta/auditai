import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: auditorias } = await supabase
    .from("auditorias")
    .select("id, perfil, red_social, score_general, nivel_general, created_at")
    .order("created_at", { ascending: false });

  const { data: suscripcion } = await supabase
    .from("suscripciones")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "authorized")
    .maybeSingle();

  return (
    <Suspense>
      <DashboardClient user={user} auditorias={auditorias ?? []} esPro={!!suscripcion} />
    </Suspense>
  );
}
