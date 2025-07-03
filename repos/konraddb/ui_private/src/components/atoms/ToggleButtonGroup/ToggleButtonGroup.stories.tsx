import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Stack from "@mui/material/Stack";

import ToggleButtonGroup from "./ToggleButtonGroup";

const ToggleGroup = () => {
  const [alignment, setAlignment] = useState<string | null>("left");
  const [alignmentSmall, setAlignmentSmall] = useState<string | null>("left");

  const values = [
    {
      value: "left",
      label: "left aligned",
    },
    {
      value: "center",
      label: "center aligned",
    },
    {
      value: "right",
      label: "right aligned",
    },
  ];
  const valuesSmall = [
    {
      value: "left-small",
      label: "left aligned small",
    },
    {
      value: "center-small",
      label: "center aligned small",
    },
    {
      value: "right-small",
      label: "right aligned small",
    },
  ];

  return (
    <Stack gap={3}>
      <ToggleButtonGroup
        currentValue={alignment}
        values={values}
        exclusive
        handleAction={(_: unknown, value: string) => {
          setAlignment(value);
        }}
        aria-label="text alignment"
      />

      <ToggleButtonGroup
        currentValue={alignmentSmall}
        values={valuesSmall}
        exclusive
        handleAction={(_: unknown, value: string) => {
          setAlignmentSmall(value);
        }}
        aria-label="text alignment"
        size="small"
      />
    </Stack>
  );
};

export default {
  title: "Components/atoms/ToggleGroup",
  component: ToggleGroup,
} as ComponentMeta<typeof ToggleGroup>;

const Template: ComponentStory<typeof ToggleGroup> = () => <ToggleGroup />;

export const Default = Template.bind({});
