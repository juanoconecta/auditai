import { NextRequest, NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body?.data?.id;
    const type = body?.type ?? body?.action;

    if (!paymentId || !type?.toString().includes("payment")) {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(mpClient);
    const info = await payment.get({ id: paymentId });

    const ref = info.external_reference;
    if (!ref) return NextResponse.json({ received: true });

    const supabase = await createClient();
    await supabase
      .from("pagos")
      .update({
        status: info.status,
        mp_payment_id: String(info.id),
      })
      .eq("external_reference", ref);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error en /api/pago/webhook:", err instanceof Error ? err.message : err);
    return NextResponse.json({ received: true });
  }
}
