import { CardProps } from "@src/entities/props";

import { Card } from "@src/components/Card/Card";

import { countdownStore } from "@src/stores/countdownStore";

type RenderComponent = {
  props: CardProps;
  container: HTMLDivElement;
};

const renderComponent = (title: string): RenderComponent => {
  const props: CardProps = {
    title: title,
  };

  const container = Card({
    title: props.title,
  });

  document.body.appendChild(container);

  return {
    props: props,
    container: container,
  };
};

jest.mock("@src/stores/countdownStore", () => ({
  countdownStore: {
    getLastDateParsed: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.mock("@src/assets/export", () => ({
  __esModule: true,
  default: {
    images: {
      cell: "mock-cell-image.png",
    },
  },
}));

describe("Card.ts", () => {
  beforeEach(() => {
    (countdownStore.getLastDateParsed as jest.Mock).mockReturnValue({
      dayName: "Monday",
      dayNumber: 25,
      monthName: "December",
      yearNumber: 2024,
      hoursNumber: 10,
      minutesNumber: "30",
      time: "AM",
    });

    (countdownStore.getState as jest.Mock).mockReturnValue({
      timeleft: 86400000,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("General Tests.", () => {
    test("It should create a div element with correct structure", () => {
      const { container } = renderComponent("iPhone 14 Pro Giveaway");

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(
        container.querySelector<HTMLImageElement>("img")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLHeadingElement>("h2")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLHeadingElement>("h4")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLDivElement>("#countdowns")
      ).toBeInTheDocument();
    });

    test("It should render title correctly", () => {
      const { container } = renderComponent("iPhone 14 Pro Giveaway");

      const heading = container.querySelector<HTMLHeadingElement>("h2");

      expect(heading?.textContent).toBe("iPhone 14 Pro Giveaway");
    });

    test("It should render date information correctly", () => {
      const { container } = renderComponent("Test Giveaway");

      const subheading = container.querySelector<HTMLHeadingElement>("h4");

      expect(subheading?.textContent).toContain("Monday");
      expect(subheading?.textContent).toContain("25");
      expect(subheading?.textContent).toContain("December");
      expect(subheading?.textContent).toContain("2024");
      expect(subheading?.textContent).toContain("10:30AM");
    });

    test("It should render cell phone image", () => {
      const { container } = renderComponent("Test Giveaway");

      const img = container.querySelector<HTMLImageElement>("img");

      expect(img?.src).toContain("mock-cell-image.png");
      expect(img?.alt).toBe("iphone");
    });

    test("It should have correct base styling classes", () => {
      const { container } = renderComponent("Test Giveaway");

      expect(container.className).toContain("flex");
      expect(container.className).toContain("items-center");
      expect(container.className).toContain("justify-center");
      expect(container.className).toContain("rounded-lg");
      expect(container.className).toContain("shadow-md");
    });
  });

  describe("Countdown rendering", () => {
    test("It should render countdown components when time is left", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 90061000,
        intervalGetTimeLeft: null,
      });

      const { container } = renderComponent("Test Giveaway");

      const countdowns = container.querySelector<HTMLDivElement>("#countdowns");

      expect(countdowns?.children.length).toBe(4);
      expect(
        container.querySelector<HTMLDivElement>("#days")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLDivElement>("#hours")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLDivElement>("#mins")
      ).toBeInTheDocument();
      expect(
        container.querySelector<HTMLDivElement>("#secs")
      ).toBeInTheDocument();
    });

    test("It should calculate days correctly", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 172800000,
        intervalGetTimeLeft: null,
      });

      const { container } = renderComponent("Test Giveaway");

      const days = container.querySelector<HTMLHeadingElement>("#days h4");

      expect(days?.textContent?.trim()).toBe("2");
    });

    test("It should calculate hours correctly", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 7200000,
        intervalGetTimeLeft: null,
      });

      const { container } = renderComponent("Test Giveaway");

      const hours = container.querySelector<HTMLHeadingElement>("#hours h4");

      expect(hours?.textContent?.trim()).toBe("2");
    });

    test("It should show expired message when timeleft is zero", () => {
      const mockInterval = 123;
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 0,
        intervalGetTimeLeft: mockInterval,
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      const { container } = renderComponent("Test Giveaway");

      const countdowns = container.querySelector<HTMLDivElement>("#countdowns");

      expect(countdowns?.textContent).toContain(
        "The time to claim the offer has expired"
      );
      expect(clearIntervalSpy).toHaveBeenCalledWith(mockInterval);
    });

    test("It should show expired message when timeleft is negative", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: -1000,
        intervalGetTimeLeft: null,
      });

      const { container } = renderComponent("Test Giveaway");

      const countdowns = container.querySelector<HTMLDivElement>("#countdowns");

      expect(countdowns?.textContent).toContain(
        "The time to claim the offer has expired"
      );
    });
  });

  describe("Store subscription", () => {
    test("It should subscribe to timeleft changes", () => {
      renderComponent("Test Giveaway");

      expect(countdownStore.subscribe).toHaveBeenCalledWith(
        "timeleft",
        expect.any(Function)
      );
    });
  });

  describe("Edge cases", () => {
    test("It should handle empty title", () => {
      const { container } = renderComponent("");

      const heading = container.querySelector<HTMLHeadingElement>("h2");

      expect(heading?.textContent).toBe("");
    });

    test("It should render correctly with single digit minutes", () => {
      (countdownStore.getLastDateParsed as jest.Mock).mockReturnValue({
        dayName: "Monday",
        dayNumber: 25,
        monthName: "December",
        yearNumber: 2024,
        hoursNumber: 10,
        minutesNumber: "05",
        time: "AM",
      });

      const { container } = renderComponent("Test");

      const subheading = container.querySelector<HTMLHeadingElement>("h4");

      expect(subheading?.textContent).toContain("10:05AM");
    });
  });
});
