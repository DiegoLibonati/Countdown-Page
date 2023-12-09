# Countdown-Page

## Getting Started

1. Clone the repository
2. Join to the correct path of the clone
3. Install LiveServer extension from Visual Studio Code [OPTIONAL]
4. Click in "Go Live" from LiveServer extension

---

1. Clone the repository
2. Join to the correct path of the clone
3. Open index.html in your favorite navigator

## Description

I made a web page that allows you to see a countdown, it can be very useful for the section of a page where a new game, product or something like that is about to be released.

## Technologies used

1. Javascript
2. CSS3
3. HTML5

## Video

https://user-images.githubusercontent.com/99032604/199129935-7fee4660-6ad7-4417-b4dc-70f5934e4e0d.mp4

## Documentation

In the `giveawayContainer` variable we will store the container where we will put the giveaway phrase, in `times` we will store all containers where we can store the containers for seconds, minutes, hours and days and in `countdownOverContainer` we will store the general container for when an offer ends we will replace it with a word that ended:

```
const giveawayContainer = document.querySelector(".info-center h4");
const times = document.querySelectorAll(".cd-center h4");
const countdownOverContainer = document.querySelector(".countdown-container");
```

In the array `months` we will store all the months and we will call the month through an index, we will do the same with the array `weekdays` but store the days of the week:

```
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
```

In lastDate we will store the end date, when the offer ends:

```
const lastDate = new Date(2023, 6, 29, 17, 30, 0);
```

The content is replaced in `giveaway`:

```
giveawayContainer.textContent = `Giveaway Ends On ${
  weekdays[lastDate.getDay()]
}, ${lastDate.getDate()} ${
  months[lastDate.getMonth()]
} ${lastDate.getFullYear()} ${lastDate.getHours()}:${lastDate.getMinutes()}am`;
```

The `getTimeLeft()` function will grab the current date through the `Date` class, then calculate the end date minus the current date and get the result in ms. Then we will do the equivalences on a day, an hour, a minute and a second in ms. We will obtain the missing days, hours, minutes and seconds in the variables `leftDays, leftHours, leftMins, leftSecs`. Then we add them in order `Day, Hours, Minutes, Seconds` to make an inner to the `time` element in order of the ForEach. In addition we will use an internal function `format0()` that will add the 0 where it has to be, if the date arrives to its end the interval is closed and in addition it is changed to a message that the offer expired.

```
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
```

The `getTimeLeft()` function will be executed the first time and then every 1000 ms, i.e. every 1 second:

```
const intervalGetTimeLeft = setInterval(getTimeLeft, 1000);

getTimeLeft();
```
