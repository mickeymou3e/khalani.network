import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";
import { styled } from "@mui/system";

import { InputBaseProps } from "@/components/molecules";

import { SearchInput } from "./SearchInput";

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
} as ComponentMeta<typeof SearchInputsStories>;

const Template: ComponentStory<typeof SearchInputsStories> = (args) => (
  <SearchInputsStories {...args} />
);

export const SearchInputs = Template.bind({});
