import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { WalletPage } from "@/components/features";

export default WalletPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "wallet-page",
        "authentication-backdrops",
      ])),
    },
  };
}
