import { useState, type ReactNode } from 'react';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import styles from './Admin.module.scss';

type ApplicationRowProps = {
  summary: ReactNode;
  details: ReactNode;
  isExpanded: boolean;
  isDeciding: boolean;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  onToggle: () => void;
};

function ApplicationRow({
  summary,
  details,
  isExpanded,
  isDeciding,
  onApprove,
  onReject,
  onToggle,
}: ApplicationRowProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const closeReject = () => {
    setIsRejectOpen(false);
    setRejectReason('');
  };

  return (
    <li>
      <div
        className={styles.row}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <span className={styles.summary}>{summary}</span>
        <div
          className={styles.actions}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {!isRejectOpen && (
            <div className={styles.actionButtons}>
              <Button
                type="button"
                disabled={isDeciding}
                onClick={() => setIsRejectOpen(true)}
              >
                Отклонить
              </Button>
              <Button
                type="button"
                disabled={isDeciding}
                onClick={onApprove}
                cta
              >
                Одобрить
              </Button>
            </div>
          )}
          {isRejectOpen && (
            <form
              className={styles.rejectForm}
              onSubmit={(event) => {
                event.preventDefault();
                const reason = rejectReason.trim();

                onReject(reason || undefined);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  closeReject();
                }
              }}
            >
              <TextareaInput
                label="Причина отклонения"
                value={rejectReason}
                disabled={isDeciding}
                onChange={(event) => setRejectReason(event.target.value)}
              />
              <div className={styles.rejectActions}>
                <Button
                  type="button"
                  disabled={isDeciding}
                  onClick={closeReject}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isDeciding} cta>
                  Отклонить
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      {isExpanded && details}
    </li>
  );
}

export default ApplicationRow;
