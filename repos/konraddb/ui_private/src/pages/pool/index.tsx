import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { PoolPage } from "@/components/features";

export default PoolPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "pool-page",
        "authentication-backdrops",
        // TO-DO: Should be used only for the 'wallet' page
        "wallet-page",
      ])),
    },
  };
}
