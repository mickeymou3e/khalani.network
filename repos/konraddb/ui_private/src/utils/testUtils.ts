import { screen, within } from "@testing-library/react";

export const checkScreenTexts = (texts: string[], presence = true) => {
  texts.forEach((text) => {
    if (presence) {
      expect(screen.queryAllByText(text).length).toBeGreaterThan(0);
    } else {
      expect(screen.queryByText(text)).toBeNull();
    }
  });
};

export const checkElementsWithinByTexts = (
  container: HTMLElement,
  texts: string[],
  presence = true
) => {
  texts.forEach((text) => {
    if (presence) {
      expect(within(container).queryAllByText(text).length).toBeGreaterThan(0);
    } else {
      expect(within(container).queryByText(text)).toBeNull();
    }
  });
};
