import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import ComputerIcon from "@mui/icons-material/Computer";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

import IconButton from "./IconButton";

type Size = "large" | "medium" | "small";
type Variant = "contained" | "outlined" | "text" | "long" | "short";

const sizes: Size[] = ["large", "medium", "small"];
const variants: Variant[] = ["contained", "outlined", "text"];

const StyledContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, 5rem)",
  gridGap: "1rem",
});

const variantMapper = (size: Size, disabled: boolean, complete: boolean) =>
  variants.map((variant) => (
    <IconButton
      key={`${variant}-${size}-${disabled}`}
      size={size}
      color="primary"
      variant={variant}
      disabled={disabled}
      complete={complete}
    >
      <ComputerIcon />
    </IconButton>
  ));

const IconButtons = () => (
  <StyledContainer>
    {sizes.map((size, idx) => (
      <React.Fragment key={idx}>
        {variantMapper(size, false, false)}
        {variantMapper(size, true, false)}
        {variantMapper(size, false, true)}
      </React.Fragment>
    ))}
  </StyledContainer>
);

export default {
  title: "components/atoms/IconButton",
  component: IconButtons,
} as ComponentMeta<typeof IconButtons>;

const Template: ComponentStory<typeof IconButtons> = () => <IconButtons />;

export const Default = Template.bind({});
Default.args = {};
