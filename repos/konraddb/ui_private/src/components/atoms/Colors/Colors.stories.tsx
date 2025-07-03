import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { ThemeModes } from "@/definitions/types";
import { paletteOptions } from "@/styles";

const GuideContainer = styled(Box)({
  display: "grid",
  width: "80%",
  gridTemplateColumns: "repeat(3, minmax(15rem, 1fr))",
  gridGap: "1rem",
});

const GuideContents = styled(Box)(({ color }: { color: string }) => ({
  borderRadius: "1rem",
  display: "flex",
  height: "100px",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  background: color,
  color: "white",
}));

const ColorGuide = ({ mode }: { mode: ThemeModes }) => (
  <GuideContainer>
    {Object.entries(paletteOptions[mode]).map(([name, value]) =>
      Object.entries(value).map(([key, color]: [string, unknown]) => (
        <GuideContents key={`${name}-${key}`} color={color as string}>
          {`${name} - ${key}(${color})`}
        </GuideContents>
      ))
    )}
  </GuideContainer>
);

export default {
  title: "components/atoms/Colors",
  component: ColorGuide,
} as ComponentMeta<typeof ColorGuide>;

const Template: ComponentStory<typeof ColorGuide> = () => (
  <Box display="flex" flexDirection="column" gap={3}>
    <Typography variant="h6">Dark theme colors</Typography>
    <ColorGuide mode={ThemeModes.dark} />
    <Typography variant="h6">Light theme colors</Typography>
    <ColorGuide mode={ThemeModes.light} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {};
