import { screen } from "@testing-library/dom";

import type { CardProps } from "@/types/props";
import type { CardComponent } from "@/types/components";

import Card from "@/components/Card/Card";

import { countdownStore } from "@/stores/countdownStore";

const defaultProps: CardProps = {
  title: "TEST GIVEAWAY",
};

const renderComponent = (props: Partial<CardProps> = {}): CardComponent => {
  const element = Card({ ...defaultProps, ...props });
  document.body.appendChild(element);
  return element;
};

describe("Card", () => {
  beforeEach(() => {
    countdownStore.setState({
      lastDate: new Date(2026, 9, 14, 10, 30, 0),
      timeleft: 5000000,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render an element with role region", () => {
      renderComponent();
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should have the correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("region", { name: "Giveaway countdown card" })
      ).toBeInTheDocument();
    });

    it("should render the title", () => {
      renderComponent();
      expect(screen.getByText("TEST GIVEAWAY")).toBeInTheDocument();
    });

    it("should render the product image", () => {
      renderComponent();
      expect(screen.getByAltText("iPhone product image")).toBeInTheDocument();
    });

    it("should render the giveaway end date", () => {
      renderComponent();
      expect(
        screen.getByText(/Giveaway Ends On Wednesday, 14 October 2026/)
      ).toBeInTheDocument();
    });

    it("should render the countdown time group with aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("group", { name: "Time remaining" })
      ).toBeInTheDocument();
    });
  });

  describe("when timeleft is positive", () => {
    it("should render all four countdown units", () => {
      renderComponent();
      expect(screen.getByText("Days")).toBeInTheDocument();
      expect(screen.getByText("Hours")).toBeInTheDocument();
      expect(screen.getByText("Mins")).toBeInTheDocument();
      expect(screen.getByText("Secs")).toBeInTheDocument();
    });

    it("should not render the expired alert", () => {
      renderComponent();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("when timeleft is zero or negative", () => {
    beforeEach(() => {
      countdownStore.setState({ timeleft: 0 });
    });

    it("should render the expired alert", () => {
      renderComponent();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should show the expired message text", () => {
      renderComponent();
      expect(
        screen.getByText("The time to claim the offer has expired")
      ).toBeInTheDocument();
    });

    it("should not render countdown units", () => {
      renderComponent();
      expect(screen.queryByText("Days")).not.toBeInTheDocument();
    });
  });

  describe("when timeleft changes via store", () => {
    it("should show the expired alert when timeleft changes to zero", () => {
      renderComponent();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      countdownStore.setState({ timeleft: 0 });
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should hide countdown units when timeleft changes to zero", () => {
      renderComponent();
      expect(screen.getByText("Days")).toBeInTheDocument();
      countdownStore.setState({ timeleft: 0 });
      expect(screen.queryByText("Days")).not.toBeInTheDocument();
    });
  });

  describe("cleanup", () => {
    it("should have a cleanup method", () => {
      const element = renderComponent();
      expect(typeof element.cleanup).toBe("function");
    });

    it("should stop updating the DOM after cleanup is called", () => {
      const element = renderComponent();
      element.cleanup?.();
      countdownStore.setState({ timeleft: 0 });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
