import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AccountPage } from "@/components/features";

export default AccountPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "account-page",
        "authentication-backdrops",
        // TO-DO: Should be used only for the 'wallet' page
        "wallet-page",
      ])),
    },
  };
}
