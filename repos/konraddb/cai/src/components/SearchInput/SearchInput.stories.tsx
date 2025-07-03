import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { SearchInput } from "./SearchInput";
import { InputBaseProps } from "../InputBase";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  resize: "both",
  overflow: "auto",
  padding: "1rem",
});

const SearchInputsStories = (props: InputBaseProps) => {
  const [value, setValue] = useState<string>("Search Text");

  return (
    <StyledContainer>
      <SearchInput value={value} setValue={setValue} {...props} />
      <SearchInput value="" placeholder="Placeholder text" {...props} />
      <SearchInput
        value="Disabled text"
        setValue={setValue}
        {...props}
        disabled
      />
    </StyledContainer>
  );
};

export default {
  title: "components/molecules/Input/SearchInput",
  component: SearchInputsStories,
} as Meta<typeof SearchInputsStories>;

// Define the template for Storybook v8
type Story = StoryObj<InputBaseProps>;

export const SearchInputs: Story = {
  render: (args) => <SearchInputsStories {...args} />,
};
