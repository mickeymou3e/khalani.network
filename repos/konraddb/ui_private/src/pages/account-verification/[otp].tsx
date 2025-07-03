import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AccountVerificationPage } from "@/components/features";

export default AccountVerificationPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "account-verification-page",
        "authentication-backdrops",
      ])),
    },
  };
}
