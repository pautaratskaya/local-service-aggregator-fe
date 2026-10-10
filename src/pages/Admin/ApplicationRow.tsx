import { useState, type ReactNode } from 'react';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import { useCatalogFormKeys } from './useCatalogFormKeys';
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

function RejectForm({
  isDeciding,
  onCancel,
  onReject,
}: {
  isDeciding: boolean;
  onCancel: () => void;
  onReject: (reason?: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');

  const submit = () => {
    onReject(rejectReason.trim() || undefined);
  };

  useCatalogFormKeys({
    onCancel,
    onSubmit: submit,
    canSubmit: !isDeciding,
    onShowErrors: () => undefined,
    submitFromTextarea: true,
  });

  return (
    <form
      className={styles.rejectForm}
      onSubmit={(event) => {
        event.preventDefault();

        if (!isDeciding) {
          submit();
        }
      }}
    >
      <TextareaInput
        label="Причина отклонения"
        value={rejectReason}
        disabled={isDeciding}
        autoFocus
        onChange={(event) => setRejectReason(event.target.value)}
      />
      <div className={styles.rejectActions}>
        <Button type="button" disabled={isDeciding} onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={isDeciding} cta>
          Отклонить
        </Button>
      </div>
    </form>
  );
}

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

  const closeReject = () => {
    setIsRejectOpen(false);
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
            <RejectForm
              isDeciding={isDeciding}
              onCancel={closeReject}
              onReject={onReject}
            />
          )}
        </div>
      </div>
      {isExpanded && details}
    </li>
  );
}

export default ApplicationRow;
