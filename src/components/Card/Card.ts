import type { CardProps } from "@/types/props";
import type { CardComponent } from "@/types/components";

import { Countdown } from "@/components/Countdown/Countdown";

import { oneDay, oneHour, oneMin, oneSec } from "@/constants/vars";

import { countdownStore } from "@/stores/countdownStore";

import { formatZero } from "@/helpers/formatZero";

import assets from "@/assets/export";

export const Card = ({ title }: CardProps): CardComponent => {
  const {
    dayName,
    dayNumber,
    monthName,
    yearNumber,
    hoursNumber,
    minutesNumber,
    time,
  } = countdownStore.getLastDateParsed();

  const divRoot = document.createElement("div") as CardComponent;
  divRoot.className =
    "relative flex items-center justify-center flex-col w-[20rem] h-auto rounded-lg shadow-md";

  divRoot.innerHTML = `
    <img
        src="${assets.images.cell}"
        alt="iphone"
        class="absolute -top-24 -right-6 z-20 h-auto w-24 object-cover"
    />

    <div class="flex flex-col items-center justify-center w-[18.5rem] h-48 p-3 m-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg shadow-sm">
        <div class="info-center self-start">
            <h2 class="text-base text-secondary">${title}</h2>
            <h4 class="text-sm text-secondary">Giveaway Ends On ${dayName}, ${dayNumber} ${monthName} ${yearNumber} ${hoursNumber}:${minutesNumber}${time}</h4> 
        </div>

        <div class="flex flex-row items-center justify-between w-full mt-2" id="countdowns">
        </div>
    </div>
  `;

  const renderCountdowns = (): void => {
    const timeleft = countdownStore.get("timeleft");
    const intervalGetTimeLeft = countdownStore.get("intervalGetTimeLeft");

    const countdowns = divRoot.querySelector<HTMLDivElement>("#countdowns")!;
    countdowns.replaceChildren();

    if (timeleft <= 0 && intervalGetTimeLeft)
      clearInterval(intervalGetTimeLeft);

    if (timeleft <= 0) {
      countdowns.innerHTML = `
          <p class="text-secondary w-full text-center">The time to claim the offer has expired</p>
        `;
      return;
    }

    const leftDays: number = Math.floor(timeleft / oneDay);
    const leftHours = formatZero(Math.floor((timeleft % oneDay) / oneHour));
    const leftMins = formatZero(Math.floor((timeleft % oneHour) / oneMin));
    const leftSecs = formatZero(Math.floor((timeleft % oneMin) / oneSec));

    const countdownDays = Countdown({
      id: "days",
      count: String(leftDays),
      title: "Days",
    });
    const countdownHours = Countdown({
      id: "hours",
      count: leftHours,
      title: "Hours",
    });
    const countdownMins = Countdown({
      id: "mins",
      count: leftMins,
      title: "Mins",
    });
    const countdownSecs = Countdown({
      id: "secs",
      count: leftSecs,
      title: "Secs",
    });

    countdowns.append(
      countdownDays,
      countdownHours,
      countdownMins,
      countdownSecs
    );
  };

  renderCountdowns();

  const countdownUnsubscribe = countdownStore.subscribe(
    "timeleft",
    renderCountdowns
  );

  divRoot.cleanup = (): void => {
    countdownUnsubscribe();
  };

  return divRoot;
};
