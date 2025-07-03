import { useTranslation } from "next-i18next";

import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules/SubpageHeader";
import { WalletPageTabs } from "@/definitions/types";

import { namespace } from "./config";
import { Dashboard } from "./Dashboard";
import { containerStyle } from "./Overview.styles";
import { Portfolio } from "./Portfolio";

interface OverviewProps {
  setSelectedTab: (value: WalletPageTabs) => void;
}

const Overview = ({ setSelectedTab }: OverviewProps) => {
  const { t } = useTranslation(namespace);

  return (
    <Box sx={containerStyle}>
      <SubpageHeader
        label={t(`${namespace}:wallet`)}
        title={t(`${namespace}:title`)}
      />

      <Dashboard setSelectedTab={setSelectedTab} />
      <Portfolio />
    </Box>
  );
};

export default Overview;
