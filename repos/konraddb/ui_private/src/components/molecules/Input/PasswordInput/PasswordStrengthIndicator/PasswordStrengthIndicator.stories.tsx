import { ComponentMeta, ComponentStory } from "@storybook/react";

import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

export default {
  title: "components/molecules/Input/PasswordInput/PasswordStrengthIndicator",
  component: PasswordStrengthIndicator,
} as ComponentMeta<typeof PasswordStrengthIndicator>;

const Template: ComponentStory<typeof PasswordStrengthIndicator> = (args) => (
  <PasswordStrengthIndicator {...args} />
);

export const Default = Template.bind({});
Default.args = {
  password: "",
};

export const Weak = Template.bind({});
Weak.args = {
  password: "abcde",
};

export const Fair = Template.bind({});
Fair.args = {
  password: "Abcdef123",
};

export const Strong = Template.bind({});
Strong.args = {
  password: "Abcdef123$",
};
