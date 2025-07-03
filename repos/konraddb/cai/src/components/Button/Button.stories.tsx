import React from "react";
import { Meta, StoryObj } from "@storybook/react"; // Import StoryObj
import { Box } from "@mui/material";
import { styled } from "@mui/system";

import Button from "./Button";

type Size = "large" | "medium" | "small";
type Variant =
  | "contained"
  | "outlined"
  | "translucent"
  | "text"
  | "long"
  | "short";

const options: Variant[] = [
  "contained",
  "outlined",
  "translucent",
  "text",
  "long",
  "short",
];

const StyledButtonContainer = styled(Box)({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(7, minmax(8rem, 1fr))",
  gridGap: "1rem",
});

const variantMapper = (
  options: Variant[],
  size: Size,
  disabled: boolean,
  complete: boolean
) =>
  options.map((option) => (
    <Button
      key={`${option}-${size}-${disabled}`}
      variant={option}
      size={size}
      complete={complete}
      disabled={disabled}
    >
      {option}
    </Button>
  ));

const DefaultButtons = ({ size }: { size: Size }) => (
  <StyledButtonContainer>
    default & hover {variantMapper(options, size, false, false)}
    disabled {variantMapper(options, size, true, false)}
    complete {variantMapper(options.slice(0, 4), size, false, true)}
  </StyledButtonContainer>
);

export default {
  title: "components/atoms/Button",
  component: DefaultButtons,
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
    },
  },
} as Meta<typeof DefaultButtons>;

// Define StoryObj for AllButtonStates
export const AllButtonStates: StoryObj<typeof DefaultButtons> = {
  args: {
    size: "medium",
  },
};
