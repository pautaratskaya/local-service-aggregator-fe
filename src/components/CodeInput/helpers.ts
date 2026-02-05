export const DIGIT_REGEX = /^\d$/;
export const DIGIT_OR_EMPTY_REGEX = /^\d*$/;

export const extractDigitsFromClipboard = (
  clipboardData: string,
  maxLength: number
): string => {
  return clipboardData.replace(/\D/g, '').slice(0, maxLength);
};

export const calculateNextFocusIndex = (
  currentIndex: number,
  digitsLength: number,
  maxLength: number
): number => {
  return Math.min(currentIndex + digitsLength, maxLength - 1);
};

export const isDigitKey = (key: string): boolean => {
  return DIGIT_REGEX.test(key);
};

export const isValidDigitInput = (input: string): boolean => {
  return DIGIT_OR_EMPTY_REGEX.test(input);
};
