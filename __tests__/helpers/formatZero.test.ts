import { formatZero } from "@/helpers/formatZero";

describe("formatZero", () => {
  it("should add leading zero to single digit numbers", () => {
    expect(formatZero(0)).toBe("00");
    expect(formatZero(5)).toBe("05");
    expect(formatZero(9)).toBe("09");
  });

  it("should not add leading zero to double digit numbers", () => {
    expect(formatZero(10)).toBe("10");
    expect(formatZero(25)).toBe("25");
    expect(formatZero(99)).toBe("99");
  });

  it("should handle numbers greater than 99", () => {
    expect(formatZero(100)).toBe("100");
    expect(formatZero(999)).toBe("999");
  });
});
