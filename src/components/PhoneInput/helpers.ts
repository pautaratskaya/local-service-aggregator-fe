export const PREFIX = '+000';
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
 * Returns editable part without immutable prefix
 * @param digits - Current digits string
 * @returns Formatted part rendered inside input
 */
export function formatEditablePart(digits: string): string {
  const formatted = formatPhoneNumber(digits);
  if (formatted === PREFIX) return '';
  return formatted.slice(PREFIX.length).trimStart();
}

/**
 * Maps cursor position from editable formatted string to digit index
 * @param cursorIndex - Cursor position in input value
 * @param digits - Current digits string
 * @returns Index in the digits string
 */
export function mapCursorToDigitIndex(
  cursorIndex: number,
  digits: string
): number {
  const formatted = formatEditablePart(digits);
  const textBeforeCursor = formatted.slice(0, cursorIndex);
  return (textBeforeCursor.match(/\d/g) || []).length;
}

/**
 * Maps digit index back to cursor position in editable formatted string
 * @param digitIndex - Index in the digits string
 * @param digits - Current digits string
 * @returns Cursor position in input value
 */
export function mapDigitIndexToCursor(
  digitIndex: number,
  digits: string
): number {
  if (digitIndex <= 0) return 0;

  const formatted = formatEditablePart(digits);
  const matches = Array.from(formatted.matchAll(/\d/g));
  const match = matches[digitIndex - 1];

  return match ? match.index! + 1 : formatted.length;
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
