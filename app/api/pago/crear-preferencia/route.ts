import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient, PRECIO_INFORME_ARS, siteUrl } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";
import type { FormData } from "@/types/informe";

export async function POST(req: NextRequest) {
  try {
    const form: FormData = await req.json();

    if (!form.perfil || !form.redSocial || !form.nicho || !form.objetivo) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: pago, error: insertError } = await supabase
      .from("pagos")
      .insert({
        perfil: form.perfil,
        form_data: form,
        user_id: user?.id ?? null,
      })
      .select("external_reference")
      .single();

    if (insertError || !pago) {
      throw new Error(insertError?.message ?? "No se pudo crear el pago");
    }

    const ref = pago.external_reference;
    const origin = siteUrl(req.nextUrl.origin);

    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: "informe-auditai",
            title: `Auditoría AuditAI - ${form.perfil}`,
            quantity: 1,
            unit_price: PRECIO_INFORME_ARS,
            currency_id: "ARS",
          },
        ],
        external_reference: ref,
        back_urls: {
          success: `${origin}/auditando?ref=${ref}`,
          failure: `${origin}/auditoria?pago=error`,
          pending: `${origin}/auditando?ref=${ref}&pending=1`,
        },
        auto_return: "approved",
        notification_url: `${origin}/api/pago/webhook`,
      },
    });

    return NextResponse.json({ initPoint: result.init_point });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error en /api/pago/crear-preferencia:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
