import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import * as stories from "./Modal.stories";

const { Default } = composeStories(stories);

describe("Modal", () => {
  test("renders the content when the modal is opened", () => {
    render(<Default />);

    expect(screen.queryByTestId("neutral-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("test-modal-content")).toBeInTheDocument();
  });

  test("closes the modal when the close button is clicked and reopened when open modal clicked", () => {
    render(<Default />);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("neutral-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("test-modal-content")).not.toBeInTheDocument();

    const openButton = screen.getByTestId("open-button");
    fireEvent.click(openButton);

    expect(screen.queryByTestId("neutral-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("test-modal-content")).toBeInTheDocument();
  });

  test("it should open an other modal", () => {
    render(<Default />);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    const openButton = screen.getByTestId("open-another-button");
    fireEvent.click(openButton);

    expect(screen.queryByTestId("neutral-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("test-modal-content")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("test-another-modal-content")
    ).toBeInTheDocument();
  });
});
