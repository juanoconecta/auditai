import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Falta ref" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: pago, error } = await supabase
    .from("pagos")
    .select("status")
    .eq("external_reference", ref)
    .single();

  if (error || !pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ status: pago.status });
}
