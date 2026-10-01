import type {
  LandlordResponse,
  LandlordWorkspaceSummary,
} from '../../api/admin/listLandlords';
import Button from '../../components/Button';
import { formatCreatedDate } from './formatApplication';
import WorkspaceDetails from './WorkspaceDetails';
import styles from './Admin.module.scss';

type DecisionMutation = {
  isError: boolean;
  error: unknown;
  variables?: number;
  mutate: (userId: number) => void;
};

type WorkspaceRowProps = {
  request: LandlordResponse;
  workspace: LandlordWorkspaceSummary;
  isExpanded: boolean;
  isDeciding: boolean;
  rejectMutation: DecisionMutation;
  approveMutation: DecisionMutation;
  onToggle: () => void;
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function WorkspaceRow({
  request,
  workspace,
  isExpanded,
  isDeciding,
  rejectMutation,
  approveMutation,
  onToggle,
}: WorkspaceRowProps) {
  const rejectError =
    rejectMutation.isError && rejectMutation.variables === request.userId
      ? rejectMutation.error
      : null;
  const approveError =
    approveMutation.isError && approveMutation.variables === request.userId
      ? approveMutation.error
      : null;

  return (
    <li>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.summary}
          aria-expanded={isExpanded}
          onClick={onToggle}
        >
          {request.realName} — {workspace.name} —{' '}
          {formatCreatedDate(workspace.createdAt)}
        </button>
        <div className={styles.actions}>
          <Button
            type="button"
            disabled={isDeciding}
            onClick={() => rejectMutation.mutate(request.userId)}
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
      </div>
      {rejectError != null && (
        <p className={styles.actionError}>
          {errorMessage(rejectError, 'Не удалось отклонить заявку')}
        </p>
      )}
      {approveError != null && (
        <p className={styles.actionError}>
          {errorMessage(approveError, 'Не удалось одобрить заявку')}
        </p>
      )}
      {isExpanded && (
        <WorkspaceDetails request={request} workspace={workspace} />
      )}
    </li>
  );
}

export default WorkspaceRow;
