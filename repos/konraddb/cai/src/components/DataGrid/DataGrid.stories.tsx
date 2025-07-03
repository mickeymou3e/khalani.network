import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Button } from "@mui/material";

import { DataGrid } from "./DataGrid";
import {
  CellClickFunc,
  ColumnProps,
  DataGridProps,
  HeaderClickFunc,
  RowProps,
} from "./types";

export default {
  title: "components/molecules/DataGrid",
  component: DataGrid,
} as Meta<DataGridProps>;

// Column definitions
const columns: ColumnProps[] = [
  {
    title: "Dessert (100g serving)",
    key: "name",
    align: "left",
    sortable: true,
  },
  { title: "Calories", key: "cals", align: "left" },
  { title: "Fat (g)", key: "fat", align: "center" },
  { title: "Carbs (g)", key: "carbs", align: "right", sortable: true },
];

// Additional columns with custom renderers
const additionalColumns: ColumnProps[] = [
  {
    title: "",
    key: "close",
    align: "left",
    width: "1px",
    headerRenderer: (column: ColumnProps, onClick: HeaderClickFunc) => (
      <Button variant="contained" size="small" onClick={() => onClick(column)}>
        Close All
      </Button>
    ),
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onClick(row, column)}
      >
        Close
      </Button>
    ),
  },
  {
    title: "",
    key: "share",
    align: "right",
    width: "1px",
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onClick(row, column)}
      >
        <ShareOutlinedIcon sx={{ width: "0.875rem", height: "0.875rem" }} />
      </Button>
    ),
  },
];

// Data provider
const dataProvider: RowProps[] = [
  { id: 1, name: "Frozen yogurt", cals: 159, fat: 12.4, carbs: 20.6 },
  { id: 2, name: "Ice cream sandwich", cals: 120, fat: 22.4, carbs: 10.5 },
  { id: 3, name: "Eclair", cals: 300, fat: 11.1, carbs: 50.9 },
];

// Define the template for Storybook v8
type Story = StoryObj<DataGridProps>;

const Template: Story = {
  render: (args) => <DataGrid {...args} />,
};

// Define the stories
export const PlainGridWithRowClick: Story = {
  ...Template,
  args: {
    dataProvider,
    columns,
    onCellClick: null,
    onRowClick: action("Row Click"),
    onHeaderClick: null,
  },
};

export const PlainGridWithSelectedRow: Story = {
  ...Template,
  args: {
    dataProvider: dataProvider.map((row) => ({
      ...row,
      selected: row.id === 2,
    })),
    columns,
    onCellClick: null,
    onRowClick: action("Row Click"),
    onHeaderClick: null,
  },
};

export const InvisibleNameColumn: Story = {
  ...Template,
  args: {
    dataProvider,
    columns: [{ ...columns[0], invisible: true }, ...columns.slice(1)],
    onCellClick: null,
    onRowClick: null,
    onHeaderClick: null,
  },
};

export const EmptyGrid: Story = {
  ...Template,
  args: {
    dataProvider: [],
    placeholder: "No data visible",
    columns,
    onCellClick: null,
    onRowClick: null,
    onHeaderClick: null,
  },
};

export const CustomChild: Story = {
  ...Template,
  args: {
    dataProvider,
    columns,
    children: <Button variant="contained">Custom child</Button>,
    onCellClick: null,
    onRowClick: null,
    onHeaderClick: null,
  },
};

export const GridWithRenderers: Story = {
  ...Template,
  args: {
    dataProvider,
    columns: [...columns, ...additionalColumns],
    onCellClick: action("Cell Click"),
    onRowClick: null,
    onHeaderClick: null,
  },
};

const otherColumns: ColumnProps[] = [
  {
    title: "Name",
    key: "name",
    sortable: true,
  },
  { title: "Value", key: "value" },
];

const largeDataProvider: RowProps[] = new Array(50).fill(0).map((_, index) => ({
  id: index,
  name: `name ${index} name ${index} name ${index}`,
  value: `value ${index} value ${index} value ${index}`,
}));

export const LargeDataWithoutPagination: Story = {
  ...Template,
  args: {
    dataProvider: largeDataProvider,
    maxHeight: 400,
    columns: [...otherColumns],
    onCellClick: null,
    onRowClick: null,
    onHeaderClick: null,
  },
};

export const LargeDataWithPagination: Story = {
  ...Template,
  args: {
    dataProvider: largeDataProvider,
    pageSize: 5,
    columns: [...otherColumns],
    enableHorizontalScroll: true,
    onCellClick: null,
    onRowClick: null,
    onHeaderClick: null,
  },
};

const collapsibleDataProvider: RowProps[] = [
  {
    id: 1,
    name: "Frozen yogurt",
    cals: 159,
    fat: 12.4,
    carbs: 20.6,
    contents: [
      {
        id: 11,
        name: "Steve",
        age: 20,
      },
      {
        id: 12,
        name: "Roger",
        age: 25,
      },
    ],
  },
  { id: 2, name: "Ice cream sandwich", cals: 120, fat: 22.4, carbs: 10.5 },
  {
    id: 3,
    name: "Eclair",
    cals: 300,
    fat: 11.1,
    carbs: 50.9,
    contents: [
      {
        id: 13,
        name: "Paul",
        age: 19,
      },
      {
        id: 14,
        name: "Frank",
        age: 17,
      },
    ],
  },
];

export const CollapsibleGrid: Story = {
  ...Template,
  args: {
    dataProvider: collapsibleDataProvider,
    columns,
    renderRowContents: (dataProvider) => (
      <DataGrid
        dataProvider={dataProvider as RowProps[]}
        columns={[
          { title: "Name", key: "name" },
          { title: "Age", key: "age" },
        ]}
        inline
      />
    ),
    enableHorizontalScroll: true,
    onCellClick: action("Cell Click"),
    onRowClick: null,
    onHeaderClick: null,
  },
};
