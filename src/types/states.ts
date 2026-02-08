export interface CountdownState extends Record<string, unknown> {
  lastDate: Date;
  timeleft: number;
  intervalGetTimeLeft: number | null;
}
