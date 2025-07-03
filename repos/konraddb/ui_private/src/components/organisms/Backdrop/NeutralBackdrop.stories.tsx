import { useState } from "react";
import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";

import { useAppDispatch } from "@/store";
import { openBackdrop } from "@/store/backdrops/backdrops.store";
import { setupStore } from "@/store/store";

import BackdropBase from "./BackdropBase";
import NeutralBackdrop, { BackdropProps } from "./NeutralBackdrop";

const TestModalContent = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100%"
    data-testid="test-modal-content"
  >
    Test Modal Content
  </Box>
);

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore();

  return <Provider store={store}>{children}</Provider>;
};

const BareboneBackdrop = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        data-testid="open-button"
      >
        open modal
      </Button>
      <BackdropBase opened={open} onClose={() => setOpen(false)}>
        <TestModalContent />
      </BackdropBase>
    </Box>
  );
};

const Backdrop = (props: BackdropProps) => {
  const { backdropsMapper } = props;

  const dispatch = useAppDispatch();
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => dispatch(openBackdrop("testModal"))}
        data-testid="open-button"
      >
        open modal
      </Button>
      <NeutralBackdrop backdropsMapper={backdropsMapper} />
    </Box>
  );
};

export default {
  title: "components/organisms/Backdrop",
  component: Backdrop,
} as ComponentMeta<typeof Backdrop>;

const BareboneTemplate: ComponentStory<typeof BareboneBackdrop> = () => (
  <BareboneBackdrop />
);

export const Barebone = BareboneTemplate.bind({});
Barebone.args = {};

const Template: ComponentStory<typeof Backdrop> = (args) => (
  <Backdrop {...args} />
);

export const WithStore = Template.bind({});
WithStore.args = {
  backdropsMapper: {
    testModal: TestModalContent,
  },
};
WithStore.decorators = [(story) => <MockStore>{story()}</MockStore>];
