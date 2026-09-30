import styles from './ErrorIcon.module.scss';

interface ErrorIconProps {
  message?: string;
  highlightedText?: string;
}

function ErrorIcon({ message, highlightedText }: ErrorIconProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        {message && <p className={styles.errorText}>{message}</p>}
        {highlightedText && (
          <p className={styles.highlightedText}>{highlightedText}</p>
        )}
      </div>
    </div>
  );
}

export default ErrorIcon;
