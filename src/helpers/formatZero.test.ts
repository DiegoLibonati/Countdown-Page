import { formatZero } from "./formatZero";

test("It must return a value with a 0 in front.", () => {
  const value = formatZero(5);

  expect(value).toEqual("05");
});

test("It must return the number in string, without adding the 0 in front.", () => {
  const value = formatZero(15);

  expect(value).toEqual("15");
});
