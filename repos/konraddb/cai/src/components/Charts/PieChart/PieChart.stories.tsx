import type { Meta, StoryObj } from "@storybook/react";
import PieChart from "./PieChart";

const meta: Meta<typeof PieChart> = {
  title: "components/molecules/Charts/PieChart",
  component: PieChart,
};
export default meta;

type Story = StoryObj<typeof PieChart>;

const dataProvider = [
  { name: "BTC", value: 30, percentage: 30 },
  { name: "ETH", value: 20, percentage: 20 },
  { name: "USDT", value: 10, percentage: 10 },
  { name: "USDC", value: 35, percentage: 35 },
  { name: "XRP", value: 5, percentage: 5 },
];

export const NoValues: Story = {
  args: {
    dataProvider: [],
  },
};

export const Populated: Story = {
  args: {
    dataProvider,
  },
};

export const Interactive: Story = {
  args: {
    dataProvider,
    interactive: true,
  },
};

export const InteractiveHiddenValues: Story = {
  args: {
    dataProvider,
    hideValues: true,
    interactive: true,
  },
};

export const WithCustomFormatter: Story = {
  args: {
    dataProvider,
    interactive: true,
    formatValue: (val: number) => String(val),
  },
};
