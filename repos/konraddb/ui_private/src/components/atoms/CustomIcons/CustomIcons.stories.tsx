import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Typography } from "@mui/material";

import {
  AuthenticatorGuy,
  Bridge,
  CarbonPrimitives,
  DollarCloud,
  EcoSystemFocus,
  EmptyGrid,
  ErrorIcon,
  FundRise,
  Growth,
  Keeper,
  KindOfWorm,
  LoaderIndicator,
  MarioMushroom,
  NeutralLogo,
  NeutronNetwork,
  PerpetualFutures,
  PowerBattery,
  SilentGuy,
  SortAscending,
  SortDescending,
  SortNone,
  StarMountain,
} from "@/components/atoms/CustomIcons";

const firstIcons = {
  AuthenticatorGuy,
  DollarCloud,
  EmptyGrid,
  MarioMushroom,
  NeutronNetwork,
  PowerBattery,
  SilentGuy,
  StarMountain,
  KindOfWorm,
  PerpetualFutures,
  Growth,
  EcoSystemFocus,
  FundRise,
  Keeper,
  ErrorIcon,
  CarbonPrimitives,
  Bridge,
};

const secondIcons = {
  NeutralLogo,
  LoaderIndicator,
  SortAscending,
  SortDescending,
  SortNone,
};

const CustomIcons = () => (
  <Box display="flex" flexDirection="column" gap={5}>
    <Box display="flex" gap={2} flexWrap="wrap">
      {Object.entries(firstIcons).map(([name, Component]) => (
        <Box
          key={name}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Component width={64} height={64} />
          <Typography variant="caption">{name}</Typography>
        </Box>
      ))}
    </Box>
    <Box display="flex" gap={2}>
      {Object.entries(secondIcons).map(([name, Component]) => (
        <Box
          key={name}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Component width={64} height={64} />
          <Typography variant="caption">{name}</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default {
  title: "components/atoms/CustomIcons",
  component: CustomIcons,
} as ComponentMeta<typeof CustomIcons>;

const Template: ComponentStory<typeof CustomIcons> = () => <CustomIcons />;

export const Default = Template.bind({});
Default.args = {};
