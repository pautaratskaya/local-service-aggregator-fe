import Button from '../Button';
import ErrorIcon from '../ErrorIcon';
import styles from './FetchErrorNotice.module.scss';

interface FetchErrorNoticeProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

function FetchErrorNotice({
  message,
  actionLabel,
  onAction,
}: FetchErrorNoticeProps) {
  return (
    <div className={styles.notice} role="alert">
      <ErrorIcon message={message} />
      <div className={styles.action}>
        <Button onClick={onAction} cta>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default FetchErrorNotice;
