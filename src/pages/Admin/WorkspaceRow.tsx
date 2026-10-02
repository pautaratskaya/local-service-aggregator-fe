import { useState } from 'react';
import type {
  LandlordResponse,
  LandlordWorkspaceSummary,
} from '../../api/admin/listLandlords';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import { formatDate } from '../../helpers';
import type { useApproveLandlord } from './hooks/useApproveLandlord';
import type { useRejectLandlord } from './hooks/useRejectLandlord';
import WorkspaceDetails from './WorkspaceDetails';
import styles from './Admin.module.scss';

type WorkspaceRowProps = {
  request: LandlordResponse;
  workspace: LandlordWorkspaceSummary;
  isExpanded: boolean;
  isDeciding: boolean;
  rejectMutation: Pick<ReturnType<typeof useRejectLandlord>, 'mutate'>;
  approveMutation: Pick<ReturnType<typeof useApproveLandlord>, 'mutate'>;
  onToggle: () => void;
};

function WorkspaceRow({
  request,
  workspace,
  isExpanded,
  isDeciding,
  rejectMutation,
  approveMutation,
  onToggle,
}: WorkspaceRowProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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
        <span className={styles.summary}>
          {request.realName} — {workspace.name} —{' '}
          {formatDate(workspace.createdAt)}
        </span>
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
                onClick={() => approveMutation.mutate(request.userId)}
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

                rejectMutation.mutate({
                  userId: request.userId,
                  ...(reason ? { reason } : {}),
                });
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
                  onClick={() => {
                    setIsRejectOpen(false);
                    setRejectReason('');
                  }}
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
      {isExpanded && (
        <WorkspaceDetails request={request} workspace={workspace} />
      )}
    </li>
  );
}

export default WorkspaceRow;
