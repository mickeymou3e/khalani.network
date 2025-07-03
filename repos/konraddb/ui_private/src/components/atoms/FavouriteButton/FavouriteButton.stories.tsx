import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";

import FavouriteButton from "./FavouriteButton";

const FavouriteButtons = () => {
  const [selected, setSelected] = useState(true);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FavouriteButton
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
      <FavouriteButton selected={false} />
      <FavouriteButton selected disabled />
      <FavouriteButton selected={false} disabled />
    </Box>
  );
};

export default {
  title: "components/atoms/FavouriteButton",
  component: FavouriteButtons,
} as ComponentMeta<typeof FavouriteButtons>;

const Template: ComponentStory<typeof FavouriteButtons> = () => (
  <FavouriteButtons />
);

export const Default = Template.bind({});
Default.args = {};
