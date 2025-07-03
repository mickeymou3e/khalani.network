import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Typography } from "@mui/material";

import { ExecutionSide } from "@/definitions/types";

import ChangeCell from "./ChangeCell";
import ExecutionSideCell from "./ExecutionSideCell";
import ValueCell from "./ValueCell";

const ComponentsWrapper = ({ isSmall }: { isSmall: boolean }) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Typography>Change Cells</Typography>
    <Box display="flex" flexDirection="column" ml={2} gap={1}>
      <ChangeCell change={12} changeDirection={1} small={isSmall} />
      <ChangeCell change={12} changeDirection={-1} small={isSmall} />
    </Box>
    <Typography>Value Cells</Typography>
    <Box display="flex" flexDirection="column" ml={2} gap={1}>
      <ValueCell value={12} secondaryValue={12} small={isSmall} />
    </Box>
    <Typography>Execution Side Cells</Typography>
    <Box display="flex" flexDirection="column" ml={2} gap={1}>
      <ExecutionSideCell side={ExecutionSide.BUY} small={isSmall} />
      <ExecutionSideCell side={ExecutionSide.SELL} small={isSmall} />
    </Box>
  </Box>
);

export default {
  title: "components/molecules/DataGrid/CellRenderers",
  component: ComponentsWrapper,
} as ComponentMeta<typeof ComponentsWrapper>;

const Template: ComponentStory<typeof ComponentsWrapper> = (args) => (
  <ComponentsWrapper {...args} />
);

export const NormalSize = Template.bind({});
NormalSize.args = { isSmall: false };

export const SmallSize = Template.bind({});
SmallSize.args = { isSmall: true };
