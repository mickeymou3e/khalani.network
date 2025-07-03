import { Box } from "@mui/material";

import { Legend, PieChart as NeutralPieChart } from "@/components/molecules";

import { containerStyle, legendWrapperStyle } from "./PieChart.styles";
import { usePieChart } from "./usePieChart";

const PieChart = () => {
  const {
    dataProvider,
    highlighted,
    hideValues,
    noBalanceYetLabel,
    handleMouseEnter,
    handleMouseLeave,
  } = usePieChart();

  return (
    <Box sx={containerStyle}>
      <NeutralPieChart
        dataProvider={dataProvider}
        selected={highlighted}
        hideValues={hideValues}
        interactive
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Box sx={legendWrapperStyle}>
        <Legend
          dataProvider={dataProvider}
          selected={highlighted}
          hideValues={hideValues}
          noDataLabel={noBalanceYetLabel}
          interactive
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </Box>
    </Box>
  );
};

export default PieChart;
