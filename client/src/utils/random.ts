export function generateRandomString(length = 8): string {
  return Math.random().toString(20).substr(2, length);
}

export function randomNumberInRange(min = 0, max = 100): number {
  return Math.random() * (max - min) + min;
}
