const giveawayContainer = document.querySelector(".info-center h4");
const times = document.querySelectorAll(".cd-center h4");
const countdownOverContainer = document.querySelector(".countdown-container");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const lastDate = new Date(2023, 6, 29, 17, 30, 0);

giveawayContainer.textContent = `Giveaway Ends On ${
  weekdays[lastDate.getDay()]
}, ${lastDate.getDate()} ${
  months[lastDate.getMonth()]
} ${lastDate.getFullYear()} ${lastDate.getHours()}:${lastDate.getMinutes()}am`;

function getTimeLeft() {
  const actualDate = new Date();

  const leftTime = lastDate - actualDate;

  const oneDay = 24 * 60 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneMin = 60 * 1000;
  const oneSec = 1000;

  const leftDays = Math.floor(leftTime / oneDay);
  const leftHours = Math.floor((leftTime % oneDay) / oneHour);
  const leftMins = Math.floor((leftTime % oneHour) / oneMin);
  const leftSecs = Math.floor((leftTime % oneMin) / oneSec);

  const arrayLeftTime = [leftDays, leftHours, leftMins, leftSecs];

  function format0(item) {
    if (item < 10) {
      item = `0${item}`;
    }
    return item;
  }

  times.forEach(function (time, index) {
    time.innerHTML = format0(arrayLeftTime[index]);
  });

  if (leftTime <= 0) {
    clearInterval(intervalGetTimeLeft);
    countdownOverContainer.innerHTML = "<p> Ends :( </p>";
  }
}

const intervalGetTimeLeft = setInterval(getTimeLeft, 1000);

getTimeLeft();
