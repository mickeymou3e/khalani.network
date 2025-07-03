import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { MarketsPage } from "@/components/features";

export default MarketsPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "markets-page",
        "authentication-backdrops",
        // TO-DO: Should be used only for the 'wallet' page
        "wallet-page",
      ])),
    },
  };
}
