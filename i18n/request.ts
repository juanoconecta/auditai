import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  return {
    locale: "es-AR",
    messages: (await import("../messages/es-AR.json")).default,
  };
});
