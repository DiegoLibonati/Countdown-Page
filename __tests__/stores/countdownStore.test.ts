import { CountdownStore } from "@/stores/countdownStore";

describe("CountdownStore", () => {
  let store: CountdownStore;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    store = new CountdownStore({
      lastDate: new Date(2026, 9, 14, 10, 30, 0),
      timeleft: 1000,
      intervalGetTimeLeft: null,
    });
  });

  describe("getLastDateParsed", () => {
    it("should return the correct day name", () => {
      expect(store.getLastDateParsed().dayName).toBe("Wednesday");
    });

    it("should return the correct month name", () => {
      expect(store.getLastDateParsed().monthName).toBe("October");
    });

    it("should return the correct day number", () => {
      expect(store.getLastDateParsed().dayNumber).toBe("14");
    });

    it("should return the correct year number", () => {
      expect(store.getLastDateParsed().yearNumber).toBe(2026);
    });

    it("should return the correct hours", () => {
      expect(store.getLastDateParsed().hoursNumber).toBe("10");
    });

    it("should return the correct minutes", () => {
      expect(store.getLastDateParsed().minutesNumber).toBe("30");
    });

    it("should return am when hours are 12 or less", () => {
      expect(store.getLastDateParsed().time).toBe("am");
    });

    it("should return pm when hours are greater than 12", () => {
      const pmStore = new CountdownStore({
        lastDate: new Date(2026, 9, 14, 15, 0, 0),
        timeleft: 1000,
        intervalGetTimeLeft: null,
      });
      expect(pmStore.getLastDateParsed().time).toBe("pm");
    });

    it("should pad day numbers below 10 with a leading zero", () => {
      const earlyStore = new CountdownStore({
        lastDate: new Date(2026, 9, 5, 10, 30, 0),
        timeleft: 1000,
        intervalGetTimeLeft: null,
      });
      expect(earlyStore.getLastDateParsed().dayNumber).toBe("05");
    });

    it("should pad minutes below 10 with a leading zero", () => {
      const earlyStore = new CountdownStore({
        lastDate: new Date(2026, 9, 14, 10, 5, 0),
        timeleft: 1000,
        intervalGetTimeLeft: null,
      });
      expect(earlyStore.getLastDateParsed().minutesNumber).toBe("05");
    });
  });

  describe("setTimeLeft", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should set timeleft to the difference between lastDate and now", () => {
      const mockNow = new Date(2026, 9, 14, 9, 0, 0);
      jest.setSystemTime(mockNow);

      store.setTimeLeft();

      const expected =
        new Date(2026, 9, 14, 10, 30, 0).valueOf() - mockNow.valueOf();
      expect(store.get("timeleft")).toBe(expected);
    });

    it("should set timeleft to a negative value when lastDate is in the past", () => {
      jest.setSystemTime(new Date(2030, 0, 1));

      store.setTimeLeft();

      expect(store.get("timeleft")).toBeLessThan(0);
    });

    it("should update timeleft each time it is called", () => {
      jest.setSystemTime(new Date(2026, 9, 14, 9, 0, 0));
      store.setTimeLeft();
      const first = store.get("timeleft");

      jest.setSystemTime(new Date(2026, 9, 14, 9, 0, 1));
      store.setTimeLeft();
      const second = store.get("timeleft");

      expect(second).toBeLessThan(first);
    });
  });

  describe("setInterval", () => {
    it("should update intervalGetTimeLeft with the given value", () => {
      store.setInterval(42);
      expect(store.get("intervalGetTimeLeft")).toBe(42);
    });

    it("should overwrite a previous interval value", () => {
      store.setInterval(10);
      store.setInterval(99);
      expect(store.get("intervalGetTimeLeft")).toBe(99);
    });
  });

  describe("cleanup", () => {
    it("should call clearInterval with the current interval id", () => {
      const mockClearInterval = jest.spyOn(global, "clearInterval");
      store.setState({ intervalGetTimeLeft: 99 });

      store.cleanup();

      expect(mockClearInterval).toHaveBeenCalledWith(99);
    });

    it("should set intervalGetTimeLeft to null after cleanup", () => {
      store.setState({ intervalGetTimeLeft: 99 });

      store.cleanup();

      expect(store.get("intervalGetTimeLeft")).toBeNull();
    });

    it("should not call clearInterval when intervalGetTimeLeft is null", () => {
      const mockClearInterval = jest.spyOn(global, "clearInterval");

      store.cleanup();

      expect(mockClearInterval).not.toHaveBeenCalled();
    });
  });
});
