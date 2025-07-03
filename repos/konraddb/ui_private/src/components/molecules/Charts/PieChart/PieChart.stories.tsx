import { ComponentMeta, ComponentStory } from "@storybook/react";

import PieChart from "./PieChart";

export default {
  title: "components/molecules/Charts/PieChart",
  component: PieChart,
} as ComponentMeta<typeof PieChart>;

const Template: ComponentStory<typeof PieChart> = (args) => (
  <PieChart {...args} />
);

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
  interactive: true,
  formatValue: (val: number) => String(val),
};
