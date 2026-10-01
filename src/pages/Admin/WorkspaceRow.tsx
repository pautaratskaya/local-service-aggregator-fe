import type {
  LandlordResponse,
  LandlordWorkspaceSummary,
} from '../../api/admin/listLandlords';
import Button from '../../components/Button';
import { formatCreatedDate } from './formatApplication';
import WorkspaceDetails from './WorkspaceDetails';
import styles from './Admin.module.scss';

type DecisionMutation = {
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

function WorkspaceRow({
  request,
  workspace,
  isExpanded,
  isDeciding,
  rejectMutation,
  approveMutation,
  onToggle,
}: WorkspaceRowProps) {
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
      {isExpanded && (
        <WorkspaceDetails request={request} workspace={workspace} />
      )}
    </li>
  );
}

export default WorkspaceRow;
