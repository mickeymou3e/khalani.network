import { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import ChangeCell from "./ChangeCell";
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
  </Box>
);

export default {
  title: "components/molecules/DataGrid/CellRenderers",
  component: ComponentsWrapper,
} as Meta<typeof ComponentsWrapper>;

// Define the template for Storybook v8
type Story = StoryObj<typeof ComponentsWrapper>;

export const NormalSize: Story = {
  args: { isSmall: false },
};

export const SmallSize: Story = {
  args: { isSmall: true },
};
