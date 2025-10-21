import { CountdownPage } from "@src/pages/CountdownPage/CountdownPage";

import { countdownStore } from "@src/stores/countdownStore";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const container = CountdownPage();
  document.body.appendChild(container);
  return { container: container };
};

jest.mock("@src/stores/countdownStore", () => ({
  countdownStore: {
    getState: jest.fn(),
    setTimeLeft: jest.fn(),
    setInterval: jest.fn(),
    getLastDateParsed: jest.fn(),
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

describe("CountdownPage.ts", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    (countdownStore.getState as jest.Mock).mockReturnValue({
      intervalGetTimeLeft: null,
      timeleft: 86400000,
    });

    (countdownStore.getLastDateParsed as jest.Mock).mockReturnValue({
      dayName: "Monday",
      dayNumber: 25,
      monthName: "December",
      yearNumber: 2024,
      hoursNumber: 10,
      minutesNumber: "30",
      time: "AM",
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("General Tests.", () => {
    test("It should render main element with correct structure", () => {
      const { container } = renderComponent();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.querySelector("#card-wrapper")).toBeInTheDocument();
    });

    test("It should have correct styling classes", () => {
      const { container } = renderComponent();

      expect(container.className).toContain("h-screen");
      expect(container.className).toContain("w-screen");
      expect(container.className).toContain("bg-background");
    });

    test("It should render Card component", () => {
      const { container } = renderComponent();

      const cardWrapper = container.querySelector("#card-wrapper");
      const card = cardWrapper?.querySelector("div");

      expect(card).toBeInTheDocument();
      expect(card?.className).toContain("flex");
    });

    test("It should render card with correct title", () => {
      const { container } = renderComponent();

      const heading = container.querySelector("h2");

      expect(heading?.textContent).toBe("OLD IPHONE GIVEAWAY");
    });
  });

  describe("Interval management", () => {
    test("It should create interval on initialization", () => {
      const setIntervalSpy = jest.spyOn(global, "setInterval");

      renderComponent();

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    test("It should call setTimeLeft every second", () => {
      renderComponent();

      expect(countdownStore.setTimeLeft).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(countdownStore.setTimeLeft).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(2000);

      expect(countdownStore.setTimeLeft).toHaveBeenCalledTimes(3);
    });

    test("It should store interval in countdownStore", () => {
      renderComponent();

      expect(countdownStore.setInterval).toHaveBeenCalledWith(
        expect.any(Number)
      );
    });

    test("It should clear previous interval if exists", () => {
      const mockInterval = 123;
      (countdownStore.getState as jest.Mock).mockReturnValue({
        intervalGetTimeLeft: mockInterval,
        timeleft: 86400000,
      });

      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      renderComponent();

      expect(clearTimeoutSpy).toHaveBeenCalledWith(mockInterval);
    });

    test("It should not clear interval if none exists", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        intervalGetTimeLeft: null,
        timeleft: 86400000,
      });

      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      renderComponent();

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    test("It should handle multiple page renders", () => {
      const { container: main1 } = renderComponent();

      document.body.removeChild(main1);

      const { container: main2 } = renderComponent();

      expect(main2).toBeInTheDocument();
      expect(countdownStore.setInterval).toHaveBeenCalledTimes(2);
    });
  });
});
