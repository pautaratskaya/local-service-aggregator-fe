import { useState, useRef, type InputHTMLAttributes } from 'react';
import styles from './PhoneInput.module.scss';
import {
  PREFIX,
  formatPhoneNumber,
  formattedPhoneToDigits,
  mapCursorToDigitIndex,
  mapDigitIndexToCursor,
  findChangeIndex,
  deleteDigitAtIndex,
  MAX_DIGITS,
} from './helpers';
import { useAutoFocus, preventScrollOnFocus } from '../../hooks/useAutoFocus';

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  onChange?: (value: string) => void;
  initialValue?: string;
};

const BelarusFlag = () => (
  <svg
    width="24"
    height="18"
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.phoneInput__icon}
  >
    <path
      d="M4 0C1.79 0 0 1.79 0 4V12H24V4C24 1.79 22.21 0 20 0H4Z"
      fill="#CE1720"
    />
    <path
      d="M0 12H24V14C24 16.21 22.21 18 20 18H4C1.79 18 0 16.21 0 14V12Z"
      fill="#00A651"
    />
  </svg>
);

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
    newDigits: string,
    digitIndex: number,
    input: HTMLInputElement
  ) => {
    setDigits(newDigits);
    onChange?.(`${PREFIX}${newDigits}`);

    setTimeout(() => {
      const cursorPos = mapDigitIndexToCursor(digitIndex, newDigits);
      input.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const newDigits = formattedPhoneToDigits(e.target.value);

    if (newDigits === digits) return;

    const changeIndex = findChangeIndex(digits, newDigits);
    updateDigitsAndCursor(newDigits, changeIndex, input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPos = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const hasSelection = cursorPos !== selectionEnd;
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

      if (cursorPos <= PREFIX.length) return;

      const digitIndex = mapCursorToDigitIndex(cursorPos, digits);

      if (digitIndex > 0) {
        const newDigits = deleteDigitAtIndex(digits, digitIndex - 1);
        updateDigitsAndCursor(newDigits, digitIndex - 1, input);
      }
    }

    if (e.key === 'Delete') {
      e.preventDefault();

      if (cursorPos < PREFIX.length) return;

      const digitIndex = mapCursorToDigitIndex(cursorPos, digits);
      const newDigits = deleteDigitAtIndex(digits, digitIndex);
      updateDigitsAndCursor(newDigits, digitIndex, input);
    }
  };

  return (
    <div className={styles.phoneInput}>
      <BelarusFlag />
      <input
        ref={inputRef}
        type="tel"
        value={formatPhoneNumber(digits)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPointerDown={preventScrollOnFocus}
        {...inputProps}
      />
    </div>
  );
}

export default PhoneInput;
