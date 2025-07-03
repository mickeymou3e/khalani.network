import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AppLayout } from "@/components/organisms";
import { RetirePage } from "@/features/RetirePage";

const Retire = () => (
  <AppLayout>
    <RetirePage />
  </AppLayout>
);

export default Retire;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "retire-page",
        "authentication-backdrops",
      ])),
    },
  };
}
