import type { Meta, StoryObj } from "@storybook/react";

import BarChart from "./BarChart";

const meta: Meta<typeof BarChart> = {
  title: "components/molecules/Charts/BarChart",
  component: BarChart,
};
export default meta;

type Story = StoryObj<typeof BarChart>;

const dataProvider = [
  {
    name: "01-23",
    solar: 0,
    wind: 20000,
    geothermal: 0,
    biomass: 40000,
    hydro: 50000,
    ocean: 0,
  },
  {
    name: "02-23",
    solar: 0,
    wind: 0,
    geothermal: 100000,
    biomass: 50000,
    hydro: 0,
    ocean: 0,
  },
  {
    name: "03-23",
    solar: 130000,
    wind: 20000,
    geothermal: 0,
    biomass: 0,
    hydro: 0,
    ocean: 0,
  },
  {
    name: "04-23",
    solar: 50000,
    wind: 50000,
    geothermal: 50000,
    biomass: 50000,
    hydro: 50000,
    ocean: 50000,
  },
  {
    name: "05-23",
    solar: 180000,
    wind: 0,
    geothermal: 0,
    biomass: 0,
    hydro: 0,
    ocean: 110000,
  },
  {
    name: "06-23",
    solar: 90000,
    wind: 0,
    geothermal: 70000,
    biomass: 0,
    hydro: 20000,
    ocean: 0,
  },
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
