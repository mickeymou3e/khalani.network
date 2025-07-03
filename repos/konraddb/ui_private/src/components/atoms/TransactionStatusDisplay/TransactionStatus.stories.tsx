import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Stack } from "@mui/material";

import { BridgeStatus, OrderStatus, TxStatus } from "@/definitions/types";

import TransactionStatusDisplay from "./TransactionStatusDisplay";

export default {
  title: "components/atoms/TransactionStatus",
  component: TransactionStatusDisplay,
} as ComponentMeta<typeof TransactionStatusDisplay>;

const OrderStatusesTemplate: ComponentStory<typeof TransactionStatusDisplay> =
  () => (
    <Stack spacing={2}>
      <TransactionStatusDisplay
        status={OrderStatus.INITIATED}
        label="Not filled"
      />
      <TransactionStatusDisplay status={OrderStatus.OPEN} label="Not filled" />
      <TransactionStatusDisplay
        status={OrderStatus.INITIATED}
        label="20% filled"
        percent={20}
        partial
      />
      <TransactionStatusDisplay status={OrderStatus.FILLED} label="Filled" />
      <TransactionStatusDisplay
        status={OrderStatus.CANCELLED}
        label="Cancelled"
      />
      <TransactionStatusDisplay
        status={OrderStatus.INITIATED}
        label="Not filled"
        small
      />
      <TransactionStatusDisplay
        status={OrderStatus.OPEN}
        label="Not filled"
        small
      />
      <TransactionStatusDisplay
        status={OrderStatus.INITIATED}
        label="20% filled"
        percent={20}
        partial
        small
      />
      <TransactionStatusDisplay
        status={OrderStatus.FILLED}
        label="Filled"
        small
      />
      <TransactionStatusDisplay
        status={OrderStatus.CANCELLED}
        label="Cancelled"
        small
      />
    </Stack>
  );

const TransactionStatusesTemplate: ComponentStory<
  typeof TransactionStatusDisplay
> = () => (
  <Stack spacing={2}>
    <TransactionStatusDisplay status={TxStatus.PENDING} label="Pending" />
    <TransactionStatusDisplay status={TxStatus.COMPLETED} label="Completed" />
    <TransactionStatusDisplay status={TxStatus.FAILED} label="Failed" />
    <TransactionStatusDisplay status={TxStatus.PENDING} label="Pending" small />
    <TransactionStatusDisplay
      status={TxStatus.COMPLETED}
      label="Completed"
      small
    />
    <TransactionStatusDisplay status={TxStatus.FAILED} label="Failed" small />
  </Stack>
);

const BridgeStatusesTemplate: ComponentStory<typeof TransactionStatusDisplay> =
  () => (
    <Stack spacing={2}>
      <TransactionStatusDisplay
        status={BridgeStatus.IN_PROGRESS}
        label="In progress"
      />
      <TransactionStatusDisplay
        status={BridgeStatus.READY_TO_BRIDGE}
        label="Ready to bridge"
      />
      <TransactionStatusDisplay
        status={BridgeStatus.IN_PROGRESS}
        label="In progress"
        small
      />
      <TransactionStatusDisplay
        status={BridgeStatus.READY_TO_BRIDGE}
        label="Ready to bridge"
        small
      />
    </Stack>
  );

export const OrderStatuses = OrderStatusesTemplate.bind({});
OrderStatuses.args = {};

export const TransactionStatuses = TransactionStatusesTemplate.bind({});
TransactionStatuses.args = {};

export const BridgeStatuses = BridgeStatusesTemplate.bind({});
BridgeStatuses.args = {};
