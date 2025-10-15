export type CountdownState = {
  lastDate: Date;
  timeleft: number;
  intervalGetTimeLeft: NodeJS.Timeout | null;
};
