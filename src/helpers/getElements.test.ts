import { getElements } from "./getElements";

import { OFFICIAL_BODY } from "../tests/jest.setup";

beforeEach(() => {
  document.body.innerHTML = OFFICIAL_BODY;
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("It must render the elements of the document that the 'getElements' function exports.", () => {
  const { countdownOverContainer, giveawayContainer, times } = getElements();

  expect(countdownOverContainer).toBeInTheDocument();
  expect(giveawayContainer).toBeInTheDocument();

  for (let time of times) {
    expect(time).toBeInTheDocument();
  }
});
