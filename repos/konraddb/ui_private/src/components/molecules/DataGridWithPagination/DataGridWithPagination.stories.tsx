import { Meta, Story } from "@storybook/react";

import { Button } from "@/components/atoms";
import { ColumnProps, RowProps } from "@/components/molecules";

import {
  DataGridWithPagination,
  DataGridWithPaginationProps,
} from "./DataGridWithPagination";

export default {
  title: "components/molecules/DataGridWithPagination",
  component: DataGridWithPagination,
} as Meta<DataGridWithPaginationProps>;

const columns: ColumnProps[] = [
  {
    title: "Name",
    key: "name",
    sortable: true,
  },
  { title: "Value", key: "value" },
];

const dataProvider: RowProps[] = new Array(50).fill(0).map((_, index) => ({
  id: index,
  name: `name ${index} name ${index} name ${index}`,
  value: `value ${index} value ${index} value ${index}`,
}));

const Template: Story<DataGridWithPaginationProps> = (args) => (
  <DataGridWithPagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  dataProvider,
  maxHeight: 400,
  pageSize: 5,
  columns,
  enableHorizontalScroll: true,
  onCellClick: null,
  onRowClick: null,
  onHeaderClick: null,
};

export const WithEndAdornment = Template.bind({});
WithEndAdornment.args = {
  ...Default.args,
  endAdornment: <Button variant="translucent">End adornment</Button>,
};
