import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import FixedSnackbar from "./FixedSnackbar";

export default {
  title: "components/molecules/FixedSnackbar",
  component: FixedSnackbar,
} as ComponentMeta<typeof FixedSnackbar>;

const Template: ComponentStory<typeof FixedSnackbar> = (args) => (
  <FixedSnackbar {...args} />
);

export const NormalVariantWithButton = Template.bind({});
NormalVariantWithButton.args = {
  text: "This is a fixed snackbar with a button.",
  buttonText: "Action",
  onAction: action("Sncakbar button clicked"),
};

export const ErrorVariant = Template.bind({});
ErrorVariant.args = {
  text: "This is a fixed snackbar.",
  error: true,
};
