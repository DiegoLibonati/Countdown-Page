import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import ZeroHourPage from "@/pages/ZeroHourPage/ZeroHourPage";

import { countdownStore } from "@/stores/countdownStore";

const renderPage = (): Page => {
  const element = ZeroHourPage();
  document.body.appendChild(element);
  return element;
};

describe("ZeroHourPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    countdownStore.setState({
      lastDate: new Date(2026, 9, 14, 10, 30, 0),
      timeleft: 5000000,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should render the main element", () => {
      renderPage();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have the correct aria-label on the main element", () => {
      renderPage();
      expect(
        screen.getByRole("main", { name: "Zero Hour page" })
      ).toBeInTheDocument();
    });

    it("should render the card wrapper section", () => {
      renderPage();
      const section = document.querySelector<HTMLElement>("#card-wrapper");
      expect(section).toBeInTheDocument();
    });

    it("should render the Card component inside the card wrapper", () => {
      renderPage();
      expect(
        screen.getByRole("region", { name: "Giveaway countdown card" })
      ).toBeInTheDocument();
    });
  });

  describe("interval setup", () => {
    it("should call setInterval with a 1000ms delay", () => {
      const mockSetInterval = jest.spyOn(global, "setInterval");
      renderPage();
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it("should store the interval id in the store", () => {
      renderPage();
      expect(countdownStore.get("intervalGetTimeLeft")).not.toBeNull();
    });

    it("should clear any existing interval before starting a new one", () => {
      countdownStore.setState({ intervalGetTimeLeft: 42 });
      const mockClearInterval = jest.spyOn(global, "clearInterval");
      renderPage();
      expect(mockClearInterval).toHaveBeenCalledWith(42);
    });

    it("should update timeleft after each interval tick", () => {
      renderPage();
      const timeleftBefore = countdownStore.get("timeleft");
      jest.advanceTimersByTime(1000);
      const timeleftAfter = countdownStore.get("timeleft");
      expect(timeleftAfter).not.toBe(timeleftBefore);
    });
  });

  describe("cleanup", () => {
    it("should have a cleanup method", () => {
      const element = renderPage();
      expect(typeof element.cleanup).toBe("function");
    });

    it("should clear the interval on cleanup", () => {
      const element = renderPage();
      const mockClearInterval = jest.spyOn(global, "clearInterval");
      element.cleanup?.();
      expect(mockClearInterval).toHaveBeenCalled();
    });

    it("should set intervalGetTimeLeft to null after cleanup", () => {
      const element = renderPage();
      element.cleanup?.();
      expect(countdownStore.get("intervalGetTimeLeft")).toBeNull();
    });
  });
});
