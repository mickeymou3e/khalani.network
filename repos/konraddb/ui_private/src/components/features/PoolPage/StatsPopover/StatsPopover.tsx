import { Stack, Typography } from "@mui/material";

import {
  BarChart,
  InfoPopover as NeutralInfoPopover,
  Legend,
  PieChart,
} from "@/components/molecules";

import {
  chartContainerStyle,
  detailsContainerStyle,
  innerChartContainerStyle,
  legendStyle,
} from "./StatsPopover.styles";
import { useStatsPopover } from "./useStatsPopover";

type StatsPopoverProps = {
  disabled: boolean;
};

const StatsPopover = ({ disabled }: StatsPopoverProps) => {
  const {
    techTypes,
    techTypeOrder,
    vintages,
    title,
    techTypeLabel,
    vintageLabel,
    formatValue,
  } = useStatsPopover();

  return (
    <NeutralInfoPopover
      disabled={disabled}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      width="auto"
    >
      <Stack sx={detailsContainerStyle}>
        <Typography variant="subtitle2" textTransform="uppercase">
          {title}
        </Typography>

        <Stack sx={chartContainerStyle} direction="row" gap={2}>
          <Stack sx={innerChartContainerStyle}>
            <Typography variant="body2">{techTypeLabel}</Typography>
            <PieChart dataProvider={techTypes} dimensions={166} />
          </Stack>
          <Stack sx={innerChartContainerStyle}>
            <Typography variant="body2">{vintageLabel}</Typography>
            <BarChart
              dataProvider={vintages}
              columnOrder={techTypeOrder}
              width={280}
              height={166}
            />
          </Stack>
          <Legend
            sx={legendStyle}
            dataProvider={techTypes}
            dimensions={220}
            formatValue={formatValue}
          />
        </Stack>
      </Stack>
    </NeutralInfoPopover>
  );
};

export default StatsPopover;
