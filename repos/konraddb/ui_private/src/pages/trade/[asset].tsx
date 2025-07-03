import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { TradePage } from "@/components/features";

export default TradePage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "trade-page",
        "authentication-backdrops",
        // TO-DO: Should be used only for the 'wallet' page
        "wallet-page",
      ])),
    },
  };
}
