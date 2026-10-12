export function ruCount(
  n: number,
  one: string,
  other: string,
  few?: string,
): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = other;

  if (mod10 === 1 && mod100 !== 11) {
    word = one;
  } else if (few && mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = few;
  }

  return `${n} ${word}`;
}
