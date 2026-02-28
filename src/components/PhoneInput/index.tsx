import { useState, useRef, type InputHTMLAttributes } from 'react';
import styles from './PhoneInput.module.scss';
import {
  PREFIX,
  formatEditablePart,
  formattedPhoneToDigits,
  MAX_DIGITS,
  mapCursorToDigitIndex,
  mapDigitIndexToCursor,
  deleteDigitAtIndex,
} from './helpers';
import { useAutoFocus } from '../../hooks/useAutoFocus';
import { BelarusFlagIcon } from '../../icons';

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  onChange?: (value: string) => void;
  initialValue?: string;
};

function PhoneInput({
  initialValue,
  onChange,
  autoFocus,
  ...inputProps
}: PhoneInputProps) {
  const [digits, setDigits] = useState(
    initialValue ? formattedPhoneToDigits(initialValue) : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useAutoFocus(inputRef, !!autoFocus);

  const updateDigitsAndCursor = (
    nextDigits: string,
    digitIndex: number,
    input: HTMLInputElement
  ) => {
    setDigits(nextDigits);
    onChange?.(`${PREFIX}${nextDigits}`);

    setTimeout(() => {
      const nextCursor = mapDigitIndexToCursor(digitIndex, nextDigits);
      input.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const rawValue = input.value;
    const cursorPos = input.selectionStart ?? rawValue.length;
    const newDigits = formattedPhoneToDigits(rawValue);
    const nextDigitIndex = (rawValue.slice(0, cursorPos).match(/\d/g) || [])
      .length;

    setDigits(newDigits);
    onChange?.(`${PREFIX}${newDigits}`);

    setTimeout(() => {
      const nextCursor = mapDigitIndexToCursor(nextDigitIndex, newDigits);
      input.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const hasSelection = selectionStart !== selectionEnd;
    const isCharacterKey = e.key.length === 1;
    const isDigit = /\d/.test(e.key);

    // Block non-digits and input at max capacity (unless replacing selection)
    if (
      isCharacterKey &&
      (!isDigit || (digits.length === MAX_DIGITS && !hasSelection))
    ) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();

      const startDigitIndex = mapCursorToDigitIndex(selectionStart, digits);
      const endDigitIndex = mapCursorToDigitIndex(selectionEnd, digits);

      if (hasSelection) {
        const nextDigits =
          digits.slice(0, startDigitIndex) + digits.slice(endDigitIndex);
        updateDigitsAndCursor(nextDigits, startDigitIndex, input);
        return;
      }

      if (startDigitIndex === 0) return;

      const removeIndex = startDigitIndex - 1;
      const nextDigits = deleteDigitAtIndex(digits, removeIndex);
      updateDigitsAndCursor(nextDigits, removeIndex, input);
      return;
    }

    if (e.key === 'Delete') {
      e.preventDefault();

      const startDigitIndex = mapCursorToDigitIndex(selectionStart, digits);
      const endDigitIndex = mapCursorToDigitIndex(selectionEnd, digits);

      if (hasSelection) {
        const nextDigits =
          digits.slice(0, startDigitIndex) + digits.slice(endDigitIndex);
        updateDigitsAndCursor(nextDigits, startDigitIndex, input);
        return;
      }

      if (startDigitIndex >= digits.length) return;

      const nextDigits = deleteDigitAtIndex(digits, startDigitIndex);
      updateDigitsAndCursor(nextDigits, startDigitIndex, input);
    }
  };

  return (
    <div className={styles.phoneInput}>
      <BelarusFlagIcon />
      <div className={styles.inputWrapper}>
        <span className={styles.prefix}>{PREFIX}</span>
        <input
          ref={inputRef}
          type="tel"
          value={formatEditablePart(digits)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...inputProps}
        />
      </div>
    </div>
  );
}

export default PhoneInput;
