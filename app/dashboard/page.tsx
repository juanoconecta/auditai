import { redirect } from "next/navigation";
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

  return <DashboardClient user={user} auditorias={auditorias ?? []} />;
}
