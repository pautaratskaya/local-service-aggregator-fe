import styles from './SuccessIcon.module.scss';

const successIcon = (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 6L6 10L14 2"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface SuccessIconProps {
  message?: string;
  highlightedText?: string;
}

function SuccessIcon({ message, highlightedText }: SuccessIconProps) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>{successIcon}</div>
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
