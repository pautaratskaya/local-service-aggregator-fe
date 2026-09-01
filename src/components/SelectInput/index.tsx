import { type SelectHTMLAttributes } from 'react';
import { TriangleDownIcon } from '../../icons';
import styles from './SelectInput.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
};

function SelectInput({
  label,
  error,
  required = false,
  options,
  placeholder,
  ...selectProps
}: SelectInputProps) {
  const titleText = error || label;
  const hasValue = String(selectProps.value ?? '').trim().length > 0;

  // TODO: select on click on component, not just input; same for the TextInput
  return (
    <div
      className={`${styles.selectInput} ${titleText ? styles.withTitle : ''} ${error ? styles.errorState : ''}`}
    >
      {titleText && (
        <span className={styles.title}>
          {titleText}
          {!error && required && ' *'}
        </span>
      )}

      <select
        {...selectProps}
        className={`${styles.select} ${!hasValue ? styles.placeholder : ''}`}
        aria-invalid={Boolean(error)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.triangleDown} aria-hidden>
        <TriangleDownIcon />
      </span>
    </div>
  );
}

export default SelectInput;
