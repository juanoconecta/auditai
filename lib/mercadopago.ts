import { MercadoPagoConfig } from "mercadopago";

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const PRECIO_INFORME_ARS = Number(process.env.PRECIO_INFORME_ARS ?? "9000");

export function siteUrl(requestOrigin: string) {
  return process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;
}
