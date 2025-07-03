import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import useBreakpoints from "@/hooks/useBreakpoints";

import { sidebarButton, sidenavWrapper } from "./Sidenav.styles";

export interface SidenavTab {
  label: string;
  value: string;
  icon: any;
}

export interface SidenavProps {
  content: SidenavTab[];
  handleClick: (value: any) => void;
  selectedTab: string;
}

const Sidenav = ({ content, handleClick, selectedTab }: SidenavProps) => {
  const { extendedDesktop } = useBreakpoints();

  return (
    <Box sx={sidenavWrapper}>
      {content.map(({ label, value, icon }) => (
        <Tooltip
          title={label}
          key={`sidenav-button-${label}`}
          placement="right"
          disableHoverListener={extendedDesktop}
        >
          <Button
            variant={selectedTab === value ? "translucent" : "text"}
            onClick={() => (selectedTab === value ? null : handleClick(value))}
            sx={sidebarButton}
            size="large"
            disableRipple
          >
            {icon}
            {extendedDesktop && label}
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
};

export default Sidenav;
