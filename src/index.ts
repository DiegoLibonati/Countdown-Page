import { getElements } from "./helpers/getElements";
import { formatZero } from "./helpers/formatZero";

import { weekdays, months } from "./constants/constants";

import "./styles.css";

const oneDay: number = 24 * 60 * 60 * 1000;
const oneHour: number = 60 * 60 * 1000;
const oneMin: number = 60 * 1000;
const oneSec: number = 1000;

let lastDate: Date;
let intervalGetTimeLeft: NodeJS.Timeout;

const getTimeLeft = (): void => {
  const { countdownOverContainer, times } = getElements();

  const actualDate = new Date();

  const leftTime: number = lastDate.valueOf() - actualDate.valueOf();

  if (leftTime <= 0) {
    clearInterval(intervalGetTimeLeft);

    const p: HTMLParagraphElement = document.createElement("p");
    p.setAttribute("class", "text-[#CCC3F6] w-full text-center");
    p.innerHTML = "The time to claim the offer has expired";
    countdownOverContainer.innerHTML = "";
    countdownOverContainer.append(p);
    return;
  }

  const leftDays: number = Math.floor(leftTime / oneDay);
  const leftHours: number = Math.floor((leftTime % oneDay) / oneHour);
  const leftMins: number = Math.floor((leftTime % oneHour) / oneMin);
  const leftSecs: number = Math.floor((leftTime % oneMin) / oneSec);

  const arrayLeftTime: number[] = [leftDays, leftHours, leftMins, leftSecs];

  times.forEach(function (time, index) {
    const headElement = time as HTMLHeadingElement;

    headElement.innerHTML = formatZero(arrayLeftTime[index]);
  });
};

const setInitialValues = () => {
  const { giveawayContainer } = getElements();

  lastDate = new Date(2025, 6, 29, 17, 30, 0);

  const dayName = weekdays[lastDate.getDay()];
  const monthName = months[lastDate.getMonth()];

  giveawayContainer.textContent = `Giveaway Ends On ${dayName}, ${lastDate.getDate()} ${monthName} ${lastDate.getFullYear()} ${lastDate.getHours()}:${lastDate.getMinutes()}am`;

  if (intervalGetTimeLeft) clearTimeout(intervalGetTimeLeft);
  intervalGetTimeLeft = setInterval(getTimeLeft, 1000);
};

const onInit = () => {
  setInitialValues();

  getTimeLeft();
};

document.addEventListener("DOMContentLoaded", onInit);
