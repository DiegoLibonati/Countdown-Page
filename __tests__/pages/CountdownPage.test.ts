import type { Page } from "@/types/pages";

import { CountdownPage } from "@/pages/CountdownPage/CountdownPage";

import { countdownStore } from "@/stores/countdownStore";

const renderPage = (): Page => {
  const container = CountdownPage();
  document.body.appendChild(container);
  return container;
};

describe("CountdownPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    countdownStore.setState({
      lastDate: futureDate,
      timeleft: 432000000,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    countdownStore.cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should render the page with correct structure", () => {
    renderPage();

    const main = document.querySelector<HTMLElement>("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("h-screen", "w-screen", "bg-background");
  });

  it("should render card component", () => {
    renderPage();

    expect(document.body.textContent).toContain("OLD IPHONE GIVEAWAY");
  });

  it("should start countdown interval", () => {
    const setIntervalSpy = jest.spyOn(global, "setInterval");

    renderPage();

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

    setIntervalSpy.mockRestore();
  });

  it("should clear previous interval if exists", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const existingInterval = setInterval(() => {
      // Interval callback
    }, 1000) as unknown as number;

    countdownStore.setInterval(existingInterval);

    renderPage();

    expect(clearIntervalSpy).toHaveBeenCalledWith(existingInterval);

    clearIntervalSpy.mockRestore();
  });

  it("should cleanup on page cleanup", () => {
    const page = renderPage();

    expect(page.cleanup).toBeDefined();
    page.cleanup?.();

    const state = countdownStore.getState();
    expect(state.intervalGetTimeLeft).toBeNull();
  });
});
