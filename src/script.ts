import { weekdays, months } from "./constants/constants";

const giveawayContainer = document.querySelector(
  ".info-center h4"
) as HTMLHeadingElement;
const times = document.querySelectorAll(".cd-center h4") as NodeList;
const countdownOverContainer = document.querySelector(
  ".countdown-container"
) as HTMLDivElement;

const oneDay: number = 24 * 60 * 60 * 1000;
const oneHour: number = 60 * 60 * 1000;
const oneMin: number = 60 * 1000;
const oneSec: number = 1000;
const lastDate: Date = new Date(2024, 6, 29, 17, 30, 0);

giveawayContainer.textContent = `Giveaway Ends On ${
  weekdays[lastDate.getDay()]
}, ${lastDate.getDate()} ${
  months[lastDate.getMonth()]
} ${lastDate.getFullYear()} ${lastDate.getHours()}:${lastDate.getMinutes()}am`;

function getTimeLeft() {
  const actualDate = new Date();

  const leftTime: number = lastDate.valueOf() - actualDate.valueOf();

  const leftDays: number = Math.floor(leftTime / oneDay);
  const leftHours: number = Math.floor((leftTime % oneDay) / oneHour);
  const leftMins: number = Math.floor((leftTime % oneHour) / oneMin);
  const leftSecs: number = Math.floor((leftTime % oneMin) / oneSec);

  const arrayLeftTime: number[] = [leftDays, leftHours, leftMins, leftSecs];

  times.forEach(function (time, index) {
    const headElement = time as HTMLHeadingElement;

    headElement.innerHTML = format0(arrayLeftTime[index]);
  });

  if (leftTime <= 0) {
    clearInterval(intervalGetTimeLeft);
    countdownOverContainer.innerHTML = "<p> Ends :( </p>";
  }
}

function format0(item: number): string {
  if (item < 10) {
    return `0${item}`;
  }
  return String(item);
}

const intervalGetTimeLeft = setInterval(getTimeLeft, 1000);

getTimeLeft();
