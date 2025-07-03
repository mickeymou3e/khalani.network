import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const variants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle",
  "body1",
  "body2",
  "body3",
  "caption",
  "buttonLarge",
  "buttonMedium",
  "buttonSmall",
  "inputText",
  "inputLabel",
  "helperText",
] as const;

type Variant = typeof variants[number];

interface StyledTypographyProps {
  label: string;
  text: string;
  variant: Variant;
}

const StyledContainer = styled(Box)({
  display: "flex",
  gap: "1.5rem",
  alignItems: "center",
  border: "1px dotted gray",
  borderRadius: "5px",
  padding: "1rem",
  margin: "0.5rem",
});

const StyledTypography = ({ label, text, variant }: StyledTypographyProps) => (
  <StyledContainer>
    <Typography>{label}</Typography>
    <Typography variant={variant}>{text}</Typography>
  </StyledContainer>
);

const Components = () => (
  <>
    {variants.map((variant) => (
      <StyledTypography
        key={variant}
        variant={variant}
        label={variant || ""}
        text="The quick brown fox jumps over the lazy dog"
      />
    ))}
  </>
);

export default {
  title: "components/atoms/Typography",
  component: Components,
} as ComponentMeta<typeof Components>;

const Template: ComponentStory<typeof Components> = () => <Components />;

export const Default = Template.bind({});
Default.args = {};
