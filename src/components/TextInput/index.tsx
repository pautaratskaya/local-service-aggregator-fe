import { type InputHTMLAttributes } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

function TextInput({ ...inputProps }: TextInputProps) {
  return (
    <div className={styles.textInput}>
      <input type="text" {...inputProps} />
    </div>
  );
}

export default TextInput;
