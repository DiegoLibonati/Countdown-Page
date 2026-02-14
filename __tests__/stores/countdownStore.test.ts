import { CountdownStore } from "@/stores/countdownStore";

describe("CountdownStore", () => {
  let store: CountdownStore;

  beforeEach(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    store = new CountdownStore({
      lastDate: futureDate,
      timeleft: 1,
      intervalGetTimeLeft: null,
    });
  });

  afterEach(() => {
    store.cleanup();
  });

  it("should initialize with correct state", () => {
    const state = store.getState();

    expect(state.lastDate).toBeInstanceOf(Date);
    expect(state.timeleft).toBe(1);
    expect(state.intervalGetTimeLeft).toBeNull();
  });

  it("should parse last date correctly", () => {
    const parsed = store.getLastDateParsed();

    expect(parsed).toHaveProperty("dayName");
    expect(parsed).toHaveProperty("monthName");
    expect(parsed).toHaveProperty("dayNumber");
    expect(parsed).toHaveProperty("yearNumber");
    expect(parsed).toHaveProperty("hoursNumber");
    expect(parsed).toHaveProperty("minutesNumber");
    expect(parsed).toHaveProperty("time");
    expect(["am", "pm"]).toContain(parsed.time);
  });

  it("should calculate time left", () => {
    store.setTimeLeft();

    const timeleft = store.get("timeleft");
    expect(timeleft).toBeGreaterThan(0);
  });

  it("should set interval", () => {
    const intervalId = 123 as unknown as number;
    store.setInterval(intervalId);

    expect(store.get("intervalGetTimeLeft")).toBe(intervalId);
  });

  it("should cleanup interval on cleanup", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const existingInterval = setInterval(() => {
      // Interval callback
    }, 1000) as unknown as number;

    store.setInterval(existingInterval);
    store.cleanup();

    expect(clearIntervalSpy).toHaveBeenCalledWith(existingInterval);
    expect(store.get("intervalGetTimeLeft")).toBeNull();

    clearIntervalSpy.mockRestore();
  });

  it("should handle cleanup when no interval is set", () => {
    store.cleanup();

    expect(store.get("intervalGetTimeLeft")).toBeNull();
  });
});
