import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AppLayout } from "@/components/organisms";
import { TermsAndCondPage } from "@/features/TermsAndCondPage";

const Retire = () => (
  <AppLayout>
    <TermsAndCondPage />
  </AppLayout>
);

export default Retire;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "authentication-backdrops",
        "terms-and-conditions",
      ])),
    },
  };
}
