import { useTranslation } from "next-i18next";

import { Typography } from "@mui/material";

import { namespace } from "@/components/features/TradePage/OrderEntryTicket/config";
import { InfoPopover as NeutralInfoPopover } from "@/components/molecules";

const InfoPopover = () => {
  const { t } = useTranslation(namespace);
  const tradingFees = t(`${namespace}:tradingFees`);

  return (
    <NeutralInfoPopover>
      <Typography variant="body2" color="primary.gray2">
        {tradingFees}
      </Typography>
    </NeutralInfoPopover>
  );
};

export default InfoPopover;
