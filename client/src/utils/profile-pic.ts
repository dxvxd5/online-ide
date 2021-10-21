export default function getInitials(name: string): string {
  if (!name) return '';
  const nameSplit = name.split(' ', 2);

  const firstInitial = nameSplit[0][0].toUpperCase();

  const secondInitial = nameSplit[1]?.slice(0, 1)?.toUpperCase() ?? '';

  return `${firstInitial}${secondInitial}`;
}
