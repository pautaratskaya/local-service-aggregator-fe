import { type TextareaHTMLAttributes } from 'react';
import styles from './TextareaInput.module.scss';

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  required?: boolean;
};

function TextareaInput({
  label,
  error,
  required = false,
  maxLength,
  value,
  ...textareaProps
}: TextareaInputProps) {
  const titleText = error || label;
  const valueLength = String(value ?? '').length;

  return (
    <div
      className={`${styles.textareaInput} ${titleText ? styles.withTitle : ''} ${error ? styles.errorState : ''}`}
    >
      {titleText && (
        <span className={styles.title}>
          {titleText}
          {!error && required && ' *'}
        </span>
      )}
      <textarea
        {...textareaProps}
        value={value}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
      />
      {maxLength !== undefined && (
        <p className={styles.meta}>
          {valueLength}/{maxLength}
        </p>
      )}
    </div>
  );
}

export default TextareaInput;
