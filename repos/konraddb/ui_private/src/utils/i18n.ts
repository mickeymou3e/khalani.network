import { i18n } from "next-i18next";

export const translate =
  (namespace: string) => (key: string, options?: any) => i18n?.t(`${namespace}:${key}`, options) || "";
