export const PREFIX = '+375';
export const MAX_DIGITS = 9;

/**
 * Parses formatted phone number back to digits only
 * @param value - Formatted phone number string
 * @returns String containing only digits without prefix, limited to MAX_DIGITS
 */
export function formattedPhoneToDigits(value: string): string {
  const withoutPrefix = value.startsWith(PREFIX)
    ? value.slice(PREFIX.length)
    : value;
  const cleanedDigits = withoutPrefix.replace(/\D/g, '');
  return cleanedDigits.slice(0, MAX_DIGITS);
}

/**
 * Formats a string of digits into a Belarusian phone number format
 * @param digitString - String of up to 9 digits
 * @returns Formatted phone number in format: +375 (XX) XXX XX XX
 */
export function formatPhoneNumber(digitString: string): string {
  const withoutPrefix = digitString.startsWith(PREFIX)
    ? digitString.slice(PREFIX.length)
    : digitString;
  const cleaned = withoutPrefix.slice(0, MAX_DIGITS);

  if (cleaned.length === 0) {
    return PREFIX;
  }

  let formatted = PREFIX + ' (';

  // First 2 digits
  formatted += cleaned.substring(0, 2);

  if (cleaned.length >= 2) {
    formatted += ')';
  }

  // Next 3 digits
  if (cleaned.length > 2) {
    formatted += ' ' + cleaned.substring(2, 5);
  }

  // Next 2 digits
  if (cleaned.length > 5) {
    formatted += '-' + cleaned.substring(5, 7);
  }

  // Last 2 digits
  if (cleaned.length > 7) {
    formatted += '-' + cleaned.substring(7, 9);
  }

  return formatted;
}

/**
 * Maps cursor position from formatted string to digit index
 * @param cursorPos - Cursor position in formatted string
 * @param currentDigits - Current digits string
 * @returns Index in the digits string
 */
export function mapCursorToDigitIndex(
  cursorIndex: number,
  digits: string
): number {
  const formatted = formatPhoneNumber(digits);
  const textBeforeCursor = formatted.slice(PREFIX.length, cursorIndex);
  return (textBeforeCursor.match(/\d/g) || []).length;
}

/**
 * Maps digit index back to cursor position in formatted string
 * @param digitIndex - Index in the digits string
 * @param newDigits - New digits string
 * @returns Cursor position in formatted string
 */
export function mapDigitIndexToCursor(
  digitIndex: number,
  digits: string
): number {
  if (digitIndex === 0) return PREFIX.length;

  const formatted = formatPhoneNumber(digits);
  const textAfterPrefix = formatted.slice(PREFIX.length);
  const matches = Array.from(textAfterPrefix.matchAll(/\d/g));

  // Return position after the digit (index + 1) adjusted for prefix
  return matches[digitIndex - 1]
    ? PREFIX.length + matches[digitIndex - 1].index! + 1
    : formatted.length;
}

/**
 * Finds the index where change occurred between old and new digit strings
 * @param oldDigits - Previous digits string
 * @param newDigits - New digits string
 * @returns Index after the changed position
 */
export function findChangeIndex(oldDigits: string, newDigits: string): number {
  for (let i = 0; i < newDigits.length; i++) {
    if (oldDigits[i] !== newDigits[i]) {
      return i + 1;
    }
  }
  return newDigits.length;
}

/**
 * Removes digit at specified index
 * @param digits - Current digits string
 * @param index - Index to remove digit at
 * @returns New digits string with digit removed
 */
export function deleteDigitAtIndex(digits: string, index: number): string {
  return digits.slice(0, index) + digits.slice(index + 1);
}
