import { NextRequest, NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { mpClient, PRECIO_PRO_ARS, siteUrl } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Tenés que iniciar sesión" }, { status: 401 });
    }

    const { data: existente } = await supabase
      .from("suscripciones")
      .select("status")
      .eq("user_id", user.id)
      .eq("status", "authorized")
      .maybeSingle();

    if (existente) {
      return NextResponse.json({ error: "Ya tenés una suscripción Pro activa" }, { status: 409 });
    }

    const { data: suscripcion, error: insertError } = await supabase
      .from("suscripciones")
      .insert({ user_id: user.id })
      .select("external_reference")
      .single();

    if (insertError || !suscripcion) {
      throw new Error(insertError?.message ?? "No se pudo crear la suscripción");
    }

    const ref = suscripcion.external_reference;
    const origin = siteUrl(req.nextUrl.origin);

    const preapproval = new PreApproval(mpClient);
    const result = await preapproval.create({
      body: {
        reason: "AuditAI Pro - Auditorías ilimitadas",
        external_reference: ref,
        payer_email: user.email,
        back_url: `${origin}/dashboard?suscripcion=ok`,
        status: "pending",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: PRECIO_PRO_ARS,
          currency_id: "ARS",
        },
      },
    });

    return NextResponse.json({ initPoint: result.init_point });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error en /api/suscripcion/crear:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
