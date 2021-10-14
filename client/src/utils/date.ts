function toHour(ms: number): number {
  const oneHour = 60 * 60 * 1000;
  return ms / oneHour;
}

export default function when(lastUpdated: number): string {
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date(Date.now());

  const elapsed = today.getTime() - lastUpdated;

  if (elapsed < oneDay) {
    if (toHour(elapsed) < today.getHours()) return 'Today';
    return 'Yesterday';
  }
  return new Date(lastUpdated).toLocaleDateString();
}
