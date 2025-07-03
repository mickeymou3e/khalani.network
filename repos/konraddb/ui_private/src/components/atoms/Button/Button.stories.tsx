import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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

const DefaultButtons = ({ size }: { complete: boolean; size: Size }) => (
  <>
    <StyledButtonContainer>
      default & hover {variantMapper(options, size, false, false)}
      disabled {variantMapper(options, size, true, false)}
      complete {variantMapper(options.slice(0, 4), size, false, true)}
    </StyledButtonContainer>
  </>
);

export default {
  title: "components/atoms/Button",
  component: DefaultButtons,
} as ComponentMeta<typeof DefaultButtons>;

const DefaultTemplate: ComponentStory<typeof DefaultButtons> = (args) => {
  const { complete, size } = args;

  return <DefaultButtons complete={complete} size={size} />;
};

export const AllButtonStates = DefaultTemplate.bind({});
AllButtonStates.args = {
  size: "medium",
};
AllButtonStates.argTypes = {
  size: {
    control: {
      type: "radio",
      options: ["large", "medium", "small"],
    },
  },
};
