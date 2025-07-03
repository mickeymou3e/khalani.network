import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RegisterPage } from "@/components/features";

export default RegisterPage;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "main-menu",
        "authentication",
      ])),
    },
  };
}
