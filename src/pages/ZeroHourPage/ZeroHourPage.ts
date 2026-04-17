import type { Page } from "@/types/pages";

import Card from "@/components/Card/Card";

import { countdownStore } from "@/stores/countdownStore";

const ZeroHourPage = (): Page => {
  const { intervalGetTimeLeft } = countdownStore.getState();

  if (intervalGetTimeLeft) clearInterval(intervalGetTimeLeft);

  const interval = setInterval(() => {
    countdownStore.setTimeLeft();
  }, 1000);
  countdownStore.setInterval(interval);

  const main = document.createElement("main") as Page;
  main.className = "h-screen w-screen bg-background";
  main.setAttribute("aria-label", "ZeroHour page");

  main.innerHTML = `
      <section class="flex items-center justify-center w-full h-full" id="card-wrapper" aria-label="Product giveaway countdown">
      </section>
    `;

  const cardWrapper = main.querySelector<HTMLElement>("#card-wrapper");

  const card = Card({ title: "OLD IPHONE GIVEAWAY" });

  cardWrapper?.append(card);

  main.cleanup = (): void => {
    card.cleanup?.();
    countdownStore.cleanup();
  };

  return main;
};

export default ZeroHourPage;
