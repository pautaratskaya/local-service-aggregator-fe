import styles from './SuccessIcon.module.scss';
import { CheckIcon } from '../../icons';

interface SuccessIconProps {
  message?: string;
  highlightedText?: string;
}

function SuccessIcon({ message, highlightedText }: SuccessIconProps) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <CheckIcon />
      </div>
      <div>
        {message && <p className={styles.successText}>{message}</p>}
        {highlightedText && (
          <p className={styles.highlightedText}>{highlightedText}</p>
        )}
      </div>
    </div>
  );
}

export default SuccessIcon;
