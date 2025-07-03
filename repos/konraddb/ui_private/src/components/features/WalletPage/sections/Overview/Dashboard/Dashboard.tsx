import { Box } from "@mui/material";

import { WalletPageTabs } from "@/definitions/types";

import { containerStyle } from "./Dashboard.styles";
import { PieChart } from "./PieChart";
import { Summary } from "./Summary";

interface DashboardProps {
  setSelectedTab: (value: WalletPageTabs) => void;
}

const Dashboard = ({ setSelectedTab }: DashboardProps) => (
  <Box sx={containerStyle}>
    <Summary setSelectedTab={setSelectedTab} />
    <PieChart />
  </Box>
);

export default Dashboard;
