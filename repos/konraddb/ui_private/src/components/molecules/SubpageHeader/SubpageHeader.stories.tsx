import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import SubpageHeader from "./SubpageHeader";

export default {
  title: "components/molecules/SubpageHeaders",
  component: SubpageHeader,
} as ComponentMeta<typeof SubpageHeader>;

const ComponentsWrapper = () => (
  <>
    <SubpageHeader
      label="Wallet"
      title="Deposits"
      subtitle="Deposit funds to your wallet to start trading."
      buttonLabel="New wallet"
      handleButtonClick={() => action("Clicked new wallet")}
    />
    <SubpageHeader
      label="Wallet"
      title="Deposits"
      subtitle="Deposit funds to your wallet to start trading."
    />
  </>
);

const Template: ComponentStory<typeof SubpageHeader> = () => (
  <ComponentsWrapper />
);

export const Default = Template.bind({});
Default.args = {};
