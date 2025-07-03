import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box, Button, Stack } from "@mui/material";

import { createMockUiInitialState } from "@/definitions/__mocks__";
import { ModalVariants } from "@/definitions/types";
import { setupStore, useAppDispatch } from "@/store";
import { openModal } from "@/store/ui";

import Modal, { ModalProps } from "./Modal";

export default {
  title: "components/molecules/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    ui: createMockUiInitialState({
      modal: {
        variant: ModalVariants.Default,
      },
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const ModalInstance = (props: ModalProps) => {
  const dispatch = useAppDispatch();
  const screenElements = [
    "Row 1",
    "Row 2",
    "Row 3",
    "Row 4",
    "Row 5",
    "Row 6",
    "Row 7",
    "Row 8",
    "Row 9",
    "Row 10",
  ];

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          data-testid="open-button"
          onClick={() => dispatch(openModal(ModalVariants.Default))}
        >
          Open modal
        </Button>

        <Button
          variant="contained"
          data-testid="open-another-button"
          onClick={() => dispatch(openModal("other"))}
        >
          Open another modal
        </Button>
      </Stack>

      <Modal {...props} variant={ModalVariants.Default}>
        <Box data-testid="test-modal-content">
          {screenElements.map((element) => (
            <Box key={element}>{element}</Box>
          ))}
        </Box>
      </Modal>

      <Modal {...props} variant="other">
        <Box data-testid="test-another-modal-content">
          This is an other modal
        </Box>
      </Modal>
    </>
  );
};

const Template: ComponentStory<typeof ModalInstance> = (args) => (
  <ModalInstance {...args} />
);

export const Default = Template.bind({});
Default.args = {};
Default.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const NoCloseButton = Template.bind({});
NoCloseButton.args = {
  disableClose: true,
};
NoCloseButton.decorators = [(story) => <MockStore>{story()}</MockStore>];
