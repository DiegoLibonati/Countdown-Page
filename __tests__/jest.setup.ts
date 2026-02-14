import "@testing-library/jest-dom";

import { mockAssets } from "@tests/__mocks__/assets.mock";

jest.mock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));
