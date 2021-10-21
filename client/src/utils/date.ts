function toHour(ms: number): number {
  const oneHour = 60 * 60 * 1000;
  return ms / oneHour;
}

export default function when(lastUpdated: number): string {
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date(Date.now());

  const elapsed = today.getTime() - lastUpdated;

  const hour = new Date(lastUpdated).getHours();
  const minutes = `${new Date(lastUpdated).getMinutes()}`.padStart(2, '0');

  if (elapsed < oneDay) {
    if (toHour(elapsed) < today.getHours())
      return `Today at ${hour}:${minutes}`;
    return `Yesterday at ${hour}:${minutes}`;
  }

  return `${new Date(lastUpdated).toLocaleDateString()} at ${hour}:${minutes} `;
}
