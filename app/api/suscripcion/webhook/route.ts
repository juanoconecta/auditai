import { NextRequest, NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body?.type ?? body?.action ?? "";
    const preapprovalId = body?.data?.id;

    if (!preapprovalId || !type.toString().includes("subscription_preapproval")) {
      return NextResponse.json({ received: true });
    }

    const preapproval = new PreApproval(mpClient);
    const info = await preapproval.get({ id: preapprovalId });

    const ref = info.external_reference;
    if (!ref) return NextResponse.json({ received: true });

    const supabase = await createClient();
    await supabase
      .from("suscripciones")
      .update({
        status: info.status,
        mp_preapproval_id: String(info.id),
      })
      .eq("external_reference", ref);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error en /api/suscripcion/webhook:", err instanceof Error ? err.message : err);
    return NextResponse.json({ received: true });
  }
}
