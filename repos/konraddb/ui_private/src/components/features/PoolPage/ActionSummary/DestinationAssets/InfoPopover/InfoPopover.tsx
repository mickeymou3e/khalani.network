import { useTranslation } from "next-i18next";

import { Typography } from "@mui/material";

import { InfoPopover as NeutralInfoPopover } from "@/components/molecules";
import { useAppSelector } from "@/store";
import { PoolModes } from "@/store/pool";

import { selectMode } from "../../../store/pool.selectors";

type StatsPopoverProps = {
  disabled?: boolean;
};

const StatsPopover = ({ disabled = false }: StatsPopoverProps) => {
  const mode = useAppSelector(selectMode);
  const namespace =
    mode === PoolModes.Deposit
      ? "pool-page:deposit:summary"
      : "pool-page:redeem:summary";

  const { t } = useTranslation(namespace);
  const label = t(`${namespace}:feesDescription`);

  return (
    <NeutralInfoPopover disabled={disabled}>
      <Typography variant="body2" color="primary.gray2">
        {label}
      </Typography>
    </NeutralInfoPopover>
  );
};

export default StatsPopover;
