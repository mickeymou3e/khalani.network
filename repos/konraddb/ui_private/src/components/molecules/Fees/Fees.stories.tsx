import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Container } from "@mui/material";

import { Symbols } from "@/definitions/types";

import Fees from "./Fees";

export default {
  title: "components/molecules/Fees",
  component: Fees,
} as ComponentMeta<typeof Fees>;

const Template: ComponentStory<typeof Fees> = (args) => (
  <Container maxWidth="mobilePortrait">
    <Fees {...args} />
  </Container>
);

export const Discounted = Template.bind({});
Discounted.args = {
  feeLabel: "Fee",
  fee: "0.01",
  discountFee: "0",
};

export const NoValues = Template.bind({});
NoValues.args = {
  feeLabel: "Fee",
  fee: Symbols.NoValue,
};
