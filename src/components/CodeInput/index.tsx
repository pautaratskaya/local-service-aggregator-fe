import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
  type ClipboardEvent,
} from 'react';
import styles from './CodeInput.module.scss';
import {
  isDigitKey,
  isValidDigitInput,
  extractDigitsFromClipboard,
  calculateNextFocusIndex,
} from './helpers';
import { useAutoFocus, preventScrollOnFocus } from '../../hooks/useAutoFocus';
import { isElementVisible } from '../../helpers/dom';

interface CodeInputProps {
  length?: number;
  onChange?: (code: string) => void;
}

function CodeInput({ length = 6, onChange }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useAutoFocus(firstInputRef, true);

  useEffect(() => {
    const code = values.join('');
    onChange?.(code);
  }, [values, onChange]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      const preventScroll = isElementVisible(input);
      input.focus({ preventScroll });
    }
  };

  const updateValue = (index: number, digit: string) => {
    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    // only to handle browser autofill (e.g., SMS OTP on mobile), not for manual input
    const value = e.target.value;
    const lastChar = value.slice(-1);

    if (!isValidDigitInput(lastChar)) return;

    updateValue(index, lastChar);

    if (lastChar && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleDigitEntry = (index: number, digit: string) => {
    updateValue(index, digit);

    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleClear = (index: number, key: 'Backspace' | 'Delete') => {
    const currentValue = values[index];

    if (key === 'Backspace') {
      if (currentValue) {
        // If current input has a value, clear it
        updateValue(index, '');
      } else if (index > 0) {
        // If current input is empty, go back and clear previous
        focusInput(index - 1);
        updateValue(index - 1, '');
      }
    } else if (key === 'Delete') {
      if (currentValue) {
        // If current input has a value, clear it
        updateValue(index, '');
      } else if (index < length - 1) {
        // If current input is empty, go forward and clear next
        focusInput(index + 1);
        updateValue(index + 1, '');
      }
    }
  };

  const handleNavigation = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      focusInput(index - 1);
    } else if (direction === 'right' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleClear(index, e.key);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleNavigation(index, 'left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNavigation(index, 'right');
    } else if (isDigitKey(e.key)) {
      e.preventDefault();
      handleDigitEntry(index, e.key);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardText = e.clipboardData.getData('text/plain');
    const digits = extractDigitsFromClipboard(clipboardText, length - index);

    const newValues = [...values];
    for (let i = 0; i < digits.length && index + i < length; i++) {
      newValues[index + i] = digits[i];
    }
    setValues(newValues);

    const nextIndex = calculateNextFocusIndex(index, digits.length, length);
    focusInput(nextIndex);
  };

  return (
    <div className={styles.codeInput}>
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
            if (index === 0) {
              firstInputRef.current = el;
            }
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={handleFocus}
          onPaste={(e) => handlePaste(index, e)}
          onPointerDown={preventScrollOnFocus}
          className={styles.digit}
        />
      ))}
    </div>
  );
}

export default CodeInput;
