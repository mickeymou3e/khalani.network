import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";
import { styled } from "@mui/system";

import { InputBaseProps } from "@/components/molecules";

import PasswordInput from "./PasswordInput";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  resize: "both",
  overflow: "auto",
  padding: "1rem",
});

const PasswordInputStories = (props: InputBaseProps) => {
  const [value, setValue] = useState<string>("Secret password");

  return (
    <StyledContainer>
      <PasswordInput
        value={value}
        placeholder="Enter password"
        setValue={setValue}
        {...props}
      />
      <PasswordInput value="" placeholder="Enter password" {...props} />
      <PasswordInput
        value="Secret password"
        setValue={setValue}
        {...props}
        disabled
      />
    </StyledContainer>
  );
};

export default {
  title: "components/molecules/Input/PasswordInput",
  component: PasswordInputStories,
} as ComponentMeta<typeof PasswordInputStories>;

const Template: ComponentStory<typeof PasswordInputStories> = (args) => (
  <PasswordInputStories {...args} />
);

export const PasswordInputs = Template.bind({});
PasswordInputs.args = {};
