import { type InputHTMLAttributes } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  required?: boolean;
};

function TextInput({
  label,
  error,
  required = false,
  type = 'text',
  ...inputProps
}: TextInputProps) {
  const titleText = error || label;

  return (
    <div
      className={`${styles.textInput} ${titleText ? styles.withTitle : ''} ${error ? styles.errorState : ''}`}
    >
      {titleText && (
        <span className={`${styles.title}`}>
          {titleText}
          {!error && required && ' *'}
        </span>
      )}
      <input type={type} {...inputProps} aria-invalid={Boolean(error)} />
    </div>
  );
}

export default TextInput;
