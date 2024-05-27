export function getRandomTimeInMilliseconds(
  minMinutes: number,
  maxMinutes: number
): number {
  const MINUTES_TO_MILLISECONDS = 60 * 1000;
  const randomMinutes = Math.random() * (maxMinutes - minMinutes);
  return (randomMinutes + minMinutes) * MINUTES_TO_MILLISECONDS;
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
