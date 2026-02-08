import type { CountdownState } from "@/types/states";
import type { ParsedDate } from "@/types/app";

import { months, weekdays } from "@/constants/vars";

import { formatZero } from "@/helpers/formatZero";

import { Store } from "@/core/store";

export class CountdownStore extends Store<CountdownState> {
  // constructor(initialState: CountdownState) {
  //   super(initialState);
  // }

  public getLastDateParsed(): ParsedDate {
    const { lastDate } = this.getState();

    const dayName = weekdays[lastDate.getDay()] ?? "";
    const monthName = months[lastDate.getMonth()] ?? "";
    const dayNumber = formatZero(lastDate.getDate());
    const yearNumber = lastDate.getFullYear();
    const hoursNumber = formatZero(lastDate.getHours());
    const minutesNumber = formatZero(lastDate.getMinutes());

    const time = parseInt(hoursNumber) <= 12 ? "am" : "pm";

    return {
      dayName: dayName,
      monthName: monthName,
      dayNumber: dayNumber,
      yearNumber: yearNumber,
      hoursNumber: hoursNumber,
      minutesNumber: minutesNumber,
      time: time,
    };
  }

  public setTimeLeft(): void {
    const { lastDate } = this.getState();

    const actualDate = new Date();
    const leftTime: number = lastDate.valueOf() - actualDate.valueOf();

    this.setState({ timeleft: leftTime });
  }

  public setInterval(interval: number): void {
    this.setState({ intervalGetTimeLeft: interval });
  }
}

export const countdownStore = new CountdownStore({
  lastDate: new Date(2026, 9, 14, 24, 0, 10),
  timeleft: 1,
  intervalGetTimeLeft: null,
});
