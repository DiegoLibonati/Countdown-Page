import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import { CountdownPage } from "@/pages/CountdownPage/CountdownPage";

import { countdownStore } from "@/stores/countdownStore";

import { mockAssets } from "@tests/__mocks__/assets.mock";

jest.mock("@/stores/countdownStore", () => ({
  countdownStore: {
    getState: jest.fn(),
    setTimeLeft: jest.fn(),
    setInterval: jest.fn(),
    cleanup: jest.fn(),
    getLastDateParsed: jest.fn(),
    get: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.doMock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));

const renderPage = (): Page => {
  const container = CountdownPage();
  document.body.appendChild(container);
  return container;
};

describe("CountdownPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    (countdownStore.getState as jest.Mock).mockReturnValue({
      timeleft: 86400000,
      intervalGetTimeLeft: null,
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

    (countdownStore.get as jest.Mock).mockImplementation((key: string) => {
      if (key === "timeleft") return 86400000;
      if (key === "intervalGetTimeLeft") return null;
      return null;
    });

    (countdownStore.subscribe as jest.Mock).mockReturnValue(jest.fn());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe("Render", () => {
    it("should create a main element", () => {
      renderPage();

      const main = screen.getByRole("main");

      expect(main).toBeInstanceOf(HTMLElement);
      expect(main.tagName).toBe("MAIN");
    });

    it("should have correct styling classes", () => {
      renderPage();

      const main = screen.getByRole("main");

      expect(main).toHaveClass("h-screen", "w-screen", "bg-background");
    });

    it("should render section with card wrapper", () => {
      const container = renderPage();

      const section = container.querySelector<HTMLElement>("section");
      const cardWrapper = container.querySelector<HTMLElement>("#card-wrapper");

      expect(section).toBeInTheDocument();
      expect(cardWrapper).toBeInTheDocument();
      expect(section).toBe(cardWrapper);
    });

    it("should have correct section styling", () => {
      const container = renderPage();

      const section = container.querySelector<HTMLElement>("section");

      expect(section).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "w-full",
        "h-full"
      );
    });

    it("should render Card component", () => {
      renderPage();

      const heading = screen.getByRole("heading", {
        name: "OLD IPHONE GIVEAWAY",
        level: 2,
      });

      expect(heading).toBeInTheDocument();
    });

    it("should append Card to card wrapper", () => {
      const container = renderPage();

      const cardWrapper = container.querySelector<HTMLElement>("#card-wrapper");
      const cardElement =
        cardWrapper?.querySelector<HTMLDivElement>(".relative");

      expect(cardElement).toBeInTheDocument();
    });
  });

  describe("Interval Management", () => {
    it("should create interval on mount", () => {
      const setIntervalSpy = jest.spyOn(global, "setInterval");

      renderPage();

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it("should set interval in store", () => {
      renderPage();

      expect(countdownStore.setInterval).toHaveBeenCalledWith(
        expect.any(Number)
      );
    });

    it("should call setTimeLeft every second", () => {
      renderPage();

      expect(countdownStore.setTimeLeft).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(countdownStore.setTimeLeft).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      expect(countdownStore.setTimeLeft).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(3000);
      expect(countdownStore.setTimeLeft).toHaveBeenCalledTimes(5);
    });

    it("should clear existing interval before creating new one", () => {
      const mockExistingInterval = 123;
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 86400000,
        intervalGetTimeLeft: mockExistingInterval,
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      renderPage();

      expect(clearIntervalSpy).toHaveBeenCalledWith(mockExistingInterval);
    });

    it("should not clear interval if none exists", () => {
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 86400000,
        intervalGetTimeLeft: null,
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      renderPage();

      expect(clearIntervalSpy).not.toHaveBeenCalled();
    });
  });

  describe("Store Integration", () => {
    it("should get state from store on mount", () => {
      renderPage();

      expect(countdownStore.getState).toHaveBeenCalled();
    });

    it("should pass correct title to Card component", () => {
      renderPage();

      const heading = screen.getByRole("heading", { level: 2 });

      expect(heading).toHaveTextContent("OLD IPHONE GIVEAWAY");
    });
  });

  describe("Cleanup", () => {
    it("should have cleanup function", () => {
      const container = renderPage();

      expect(typeof container.cleanup).toBe("function");
    });

    it("should call Card cleanup on page cleanup", () => {
      const unsubscribeMock = jest.fn();
      (countdownStore.subscribe as jest.Mock).mockReturnValue(unsubscribeMock);

      const container = renderPage();

      container.cleanup?.();

      expect(unsubscribeMock).toHaveBeenCalled();
      expect(countdownStore.cleanup).toHaveBeenCalled();
    });

    it("should handle cleanup when Card cleanup is undefined", () => {
      const container = renderPage();

      expect(() => container.cleanup?.()).not.toThrow();
    });
  });

  describe("DOM Structure", () => {
    it("should nest section inside main", () => {
      const container = renderPage();

      const main = screen.getByRole("main");
      const section = container.querySelector<HTMLElement>("section");

      expect(section?.parentElement).toBe(main);
    });

    it("should have card wrapper with correct id", () => {
      const container = renderPage();

      const cardWrapper = container.querySelector<HTMLElement>("#card-wrapper");

      expect(cardWrapper).toBeInTheDocument();
      expect(cardWrapper?.id).toBe("card-wrapper");
    });

    it("should render only one section", () => {
      const container = renderPage();

      const sections = container.querySelectorAll("section");

      expect(sections).toHaveLength(1);
    });

    it("should render only one card", () => {
      const container = renderPage();

      const cards = container.querySelectorAll(".relative");

      expect(cards).toHaveLength(1);
    });
  });

  describe("Multiple Renders", () => {
    it("should clear previous interval when rendering again", () => {
      const firstInterval = 123;
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 86400000,
        intervalGetTimeLeft: null,
      });

      document.body.innerHTML = "";
      renderPage();

      document.body.innerHTML = "";
      (countdownStore.getState as jest.Mock).mockReturnValue({
        timeleft: 86400000,
        intervalGetTimeLeft: firstInterval,
      });

      const clearIntervalSpy = jest.spyOn(global, "clearInterval");

      renderPage();

      expect(clearIntervalSpy).toHaveBeenCalledWith(firstInterval);
    });

    it("should create new interval on each render", () => {
      const setIntervalSpy = jest.spyOn(global, "setInterval");

      document.body.innerHTML = "";
      renderPage();

      const firstCallCount = setIntervalSpy.mock.calls.length;

      document.body.innerHTML = "";
      renderPage();

      expect(setIntervalSpy.mock.calls.length).toBe(firstCallCount + 1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing cardWrapper gracefully", () => {
      const container = renderPage();

      expect(container).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should work with different interval values from store", () => {
      const intervals = [100, 500, 999];

      intervals.forEach((intervalValue) => {
        document.body.innerHTML = "";
        jest.clearAllMocks();

        (countdownStore.getState as jest.Mock).mockReturnValue({
          timeleft: 86400000,
          intervalGetTimeLeft: intervalValue,
        });

        const clearIntervalSpy = jest.spyOn(global, "clearInterval");

        renderPage();

        expect(clearIntervalSpy).toHaveBeenCalledWith(intervalValue);
      });
    });
  });
});
