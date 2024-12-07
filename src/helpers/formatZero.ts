export const formatZero = (item: number): string => {
  if (item < 10) return `0${item}`;
  return String(item);
};
