import { MercadoPagoConfig } from "mercadopago";

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const PRECIO_INFORME_ARS = Number(process.env.PRECIO_INFORME_ARS ?? "9000");
export const PRECIO_PRO_ARS = Number(process.env.PRECIO_PRO_ARS ?? "19000");

export function siteUrl(requestOrigin: string) {
  return process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;
}

export function mpErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Error desconocido al comunicarse con Mercado Pago";
}
