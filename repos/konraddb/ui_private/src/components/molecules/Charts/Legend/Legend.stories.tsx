import { ComponentMeta, ComponentStory } from "@storybook/react";

import Legend from "./Legend";

export default {
  title: "components/molecules/Charts/Legend",
  component: Legend,
} as ComponentMeta<typeof Legend>;

const Template: ComponentStory<typeof Legend> = (args) => <Legend {...args} />;

const dataProvider = [
  {
    name: "BTC",
    value: 30,
    percentage: 30,
  },
  {
    name: "ETH",
    value: 20,
    percentage: 20,
  },
  {
    name: "USDT",
    value: 10,
    percentage: 10,
  },
  {
    name: "USDC",
    value: 35,
    percentage: 35,
  },
  {
    name: "XRP",
    value: 5,
    percentage: 5,
  },
];

export const NoValues = Template.bind({});
NoValues.args = {
  dataProvider: [],
  noDataLabel: "No data",
};

export const Populated = Template.bind({});
Populated.args = {
  dataProvider,
};

export const Interactive = Template.bind({});
Interactive.args = {
  dataProvider,
  interactive: true,
};

export const InteractiveHiddenValues = Template.bind({});
InteractiveHiddenValues.args = {
  dataProvider,
  hideValues: true,
  interactive: true,
};

export const WithCustomFormatter = Template.bind({});
WithCustomFormatter.args = {
  dataProvider,
  formatValue: (val: number) => String(val),
};
