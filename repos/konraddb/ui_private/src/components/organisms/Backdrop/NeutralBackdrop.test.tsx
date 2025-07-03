import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";

import * as stories from "./NeutralBackdrop.stories";

const { WithStore, Barebone } = composeStories(stories);

describe("Backdrops", () => {
  describe("BareboneBackdrop", () => {
    test("renders the content when a backdrop is opened", () => {
      render(<Barebone />);

      expect(screen.queryByTestId("neutral-backdrop")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("test-modal-content")
      ).not.toBeInTheDocument();

      const openButton = screen.getByTestId("open-button");
      fireEvent.click(openButton);

      expect(screen.getByTestId("neutral-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("test-modal-content")).toBeInTheDocument();
    });

    test("closes the backdrop when the close button is clicked", () => {
      render(<Barebone />);

      const openButton = screen.getByTestId("open-button");
      fireEvent.click(openButton);

      expect(screen.getByTestId("neutral-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("test-modal-content")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("neutral-backdrop")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("test-modal-content")
      ).not.toBeInTheDocument();
    });
  });

  describe("NeutralBackdrop", () => {
    test("renders the content when a backdrop is opened", () => {
      render(<WithStore />);

      expect(screen.queryByTestId("neutral-backdrop")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("test-modal-content")
      ).not.toBeInTheDocument();

      const openButton = screen.getByTestId("open-button");
      fireEvent.click(openButton);

      expect(screen.getByTestId("neutral-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("test-modal-content")).toBeInTheDocument();
    });

    test("closes the backdrop when the close button is clicked", () => {
      render(<WithStore />);

      const openButton = screen.getByTestId("open-button");
      fireEvent.click(openButton);

      expect(screen.getByTestId("neutral-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("test-modal-content")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-button");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("neutral-backdrop")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("test-modal-content")
      ).not.toBeInTheDocument();
    });
  });
});
