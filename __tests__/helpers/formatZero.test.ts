import { formatZero } from "@/helpers/formatZero";

describe("formatZero", () => {
  describe("when the number is less than 10", () => {
    it("should prepend a zero", () => {
      expect(formatZero(5)).toBe("05");
    });

    it("should format 0 as 00", () => {
      expect(formatZero(0)).toBe("00");
    });

    it("should format 9 as 09", () => {
      expect(formatZero(9)).toBe("09");
    });

    it("should format 1 as 01", () => {
      expect(formatZero(1)).toBe("01");
    });
  });

  describe("when the number is 10 or greater", () => {
    it("should return the number as a string without padding", () => {
      expect(formatZero(10)).toBe("10");
    });

    it("should return large numbers as a string", () => {
      expect(formatZero(365)).toBe("365");
    });

    it("should return exactly 99 as 99", () => {
      expect(formatZero(99)).toBe("99");
    });
  });
});
