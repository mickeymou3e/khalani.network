import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const ns = [
  "common",
  "main-menu",
  "trade-page",
  "markets-page",
  "authentication-backdrops",
  "authentication",
  "account-page",
  "wallet-page",
  "terms-and-conditions",
  "retire-page",
  "bridge-page",
];
const supportedLngs = ["en", "de"];
const resources = ns.reduce((acc, n) => {
  supportedLngs.forEach((lng) => {
    if (!acc[lng]) acc[lng] = {};
    acc[lng] = {
      ...acc[lng],
      [n]: require(`../public/locales/${lng}/${n}.json`),
    };
  });
  return acc;
}, {});

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    // debug: true,
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    ns,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs,
    resources,
  });

export default i18n;
