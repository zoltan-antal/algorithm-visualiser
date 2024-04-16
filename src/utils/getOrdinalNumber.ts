const getOrdinalNumber = (n: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? 'th'
      : suffixes[lastDigit] || 'th';

  return n + suffix;
};

export default getOrdinalNumber;
