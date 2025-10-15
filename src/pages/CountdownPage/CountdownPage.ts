import { Card } from "@src/components/Card/Card";
import { countdownStore } from "@src/stores/countdownStore";

export const CountdownPage = (): HTMLElement => {
  const { intervalGetTimeLeft } = countdownStore.getState();

  if (intervalGetTimeLeft) clearTimeout(intervalGetTimeLeft);
  const interval = setInterval(() => countdownStore.setTimeLeft(), 1000);
  countdownStore.setInterval(interval);

  const main = document.createElement("main");
  main.className = "h-screen w-screen bg-background";

  main.innerHTML = `
        <section class="flex items-center justify-center w-full h-full" id="card-wrapper">
        </section>
    `;

  const cardWrapper = main.querySelector<HTMLElement>("#card-wrapper");

  const card = Card({ title: "OLD IPHONE GIVEAWAY" });

  cardWrapper?.append(card);

  return main;
};
