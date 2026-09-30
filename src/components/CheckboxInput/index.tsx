import styles from './CheckboxInput.module.scss';

type CheckboxInputProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
};

function CheckboxInput({
  label,
  checked,
  onChange,
  error,
  required = false,
}: CheckboxInputProps) {
  return (
    <div className={styles.checkboxInput}>
      <label className={checked ? styles.checked : ''}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
        />
        <span className={styles.box} aria-hidden="true" />
        <span className={styles.label}>
          {label}
          {required && ' *'}
        </span>
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default CheckboxInput;
