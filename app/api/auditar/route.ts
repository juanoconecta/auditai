import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { FormData, InformeAuditoria } from "@/types/informe";

const client = new Anthropic();

const PROMPT = (data: FormData) => `
Sos un experto en marketing digital y auditoría de perfiles en redes sociales.
Analizá el siguiente perfil y generá un informe profesional completo en JSON.

Perfil: ${data.perfil}
Red social: ${data.redSocial}
Nicho/Industria: ${data.nicho}
Objetivo principal: ${data.objetivo}
Descripción del negocio o persona: ${data.descripcion}

Generá un JSON con EXACTAMENTE esta estructura (sin markdown, solo JSON puro):
{
  "perfil": "${data.perfil}",
  "redSocial": "${data.redSocial}",
  "scoreGeneral": <número 0-100>,
  "nivelGeneral": <"Excelente" | "Muy bueno" | "En desarrollo" | "Necesita trabajo">,
  "resumenEjecutivo": <2-3 oraciones resumiendo el estado del perfil>,
  "categorias": [
    { "nombre": "Bio & Presentación", "score": <0-100>, "descripcion": <1 oración de diagnóstico> },
    { "nombre": "Estética Visual", "score": <0-100>, "descripcion": <1 oración> },
    { "nombre": "Estrategia de Contenido", "score": <0-100>, "descripcion": <1 oración> },
    { "nombre": "Engagement", "score": <0-100>, "descripcion": <1 oración> },
    { "nombre": "Claridad Comercial", "score": <0-100>, "descripcion": <1 oración> },
    { "nombre": "Crecimiento", "score": <0-100>, "descripcion": <1 oración> }
  ],
  "benchmark": {
    "industria": "${data.nicho}",
    "promedioIndustria": <número 0-100>,
    "posicion": <"Por encima del promedio" | "En el promedio" | "Por debajo del promedio">,
    "descripcion": <1-2 oraciones comparando con la industria>
  },
  "foda": {
    "fortalezas": [{"texto": <string>}, {"texto": <string>}, {"texto": <string>}],
    "oportunidades": [{"texto": <string>}, {"texto": <string>}, {"texto": <string>}],
    "debilidades": [{"texto": <string>}, {"texto": <string>}, {"texto": <string>}],
    "amenazas": [{"texto": <string>}, {"texto": <string>}]
  },
  "clienteIdeal": {
    "edad": <ej. "25-35 años">,
    "genero": <ej. "Mayormente femenino (70%)">,
    "intereses": [<string>, <string>, <string>, <string>],
    "descripcion": <2 oraciones describiendo el cliente ideal>
  },
  "recomendaciones": [
    {
      "titulo": <string corto>,
      "descripcion": <1-2 oraciones concretas>,
      "impacto": <ej. "+20% engagement en 30 días">,
      "prioridad": <"alta" | "media" | "baja">
    }
  ],
  "proyeccion90dias": [
    { "mes": "Mes 1", "descripcion": <acción principal>, "metrica": <resultado esperado> },
    { "mes": "Mes 2", "descripcion": <acción principal>, "metrica": <resultado esperado> },
    { "mes": "Mes 3", "descripcion": <acción principal>, "metrica": <resultado esperado> }
  ],
  "fechaGeneracion": "${new Date().toISOString()}"
}

Incluí exactamente 5 recomendaciones ordenadas por prioridad (alta primero).
Basá el análisis en mejores prácticas reales de ${data.redSocial} para el nicho ${data.nicho}.
Respondé ÚNICAMENTE con el JSON, sin texto adicional.
`;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    let body: FormData;
    const supabaseEarly = await createClient();

    if (payload.ref) {
      const { data: pago, error: pagoError } = await supabaseEarly
        .from("pagos")
        .select("form_data, status, used")
        .eq("external_reference", payload.ref)
        .single();

      if (pagoError || !pago) {
        return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
      }
      if (pago.status !== "approved") {
        return NextResponse.json({ error: "El pago todavía no fue aprobado" }, { status: 402 });
      }
      if (pago.used) {
        return NextResponse.json({ error: "Este pago ya fue utilizado" }, { status: 409 });
      }

      body = pago.form_data as FormData;
      await supabaseEarly.from("pagos").update({ used: true }).eq("external_reference", payload.ref);
    } else {
      body = payload as FormData;
    }

    if (!body.perfil || !body.redSocial || !body.nicho || !body.objetivo) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8096,
      messages: [
        {
          role: "user",
          content: PROMPT(body),
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const informe: InformeAuditoria = JSON.parse(cleaned);

    // Guardar en Supabase si hay sesión activa
    try {
      const { data: { user } } = await supabaseEarly.auth.getUser();
      if (user) {
        await supabaseEarly.from("auditorias").insert({
          user_id: user.id,
          perfil: informe.perfil,
          red_social: informe.redSocial,
          score_general: informe.scoreGeneral,
          nivel_general: informe.nivelGeneral,
          informe,
        });
      }
    } catch (e) {
      console.warn("No se pudo guardar en Supabase:", e);
    }

    return NextResponse.json(informe);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error en /api/auditar:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
