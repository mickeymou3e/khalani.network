import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AppLayout } from "@/components/organisms";
import { BridgePage } from "@/features/BridgePage";

const Bridge = () => (
  <AppLayout>
    <BridgePage />
  </AppLayout>
);

export default Bridge;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "bridge-page",
        "authentication-backdrops",
      ])),
    },
  };
}
