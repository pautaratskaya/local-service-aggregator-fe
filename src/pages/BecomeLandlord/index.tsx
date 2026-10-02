import PageLoader from '../../components/PageLoader';
import Modal from '../../components/Modal';
import WorkspaceForm from '../../components/WorkspaceForm';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLandlordWorkspaces } from '../../hooks/useLandlordWorkspaces';
import { ROLE_APPLICATION_STATUSES } from '../../types/user';
import { useSubmitLandlordApplication } from './hooks/useSubmitLandlordApplication';
import { pickRejectedWorkspace } from './rejectedWorkspace';

function BecomeLandlord() {
  const { data: user } = useCurrentUser();
  const isReapply =
    user?.landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED;
  const workspacesQuery = useLandlordWorkspaces(isReapply);
  const rejectedWorkspace = pickRejectedWorkspace(workspacesQuery.data);
  const submitMutation = useSubmitLandlordApplication();
  const showLoader = isReapply && !workspacesQuery.isError && workspacesQuery.isLoading;

  return (
    <Modal title={isReapply ? 'Исправить заявку' : 'Стать арендодателем'}>
      {showLoader ? (
        <PageLoader />
      ) : (
        <WorkspaceForm
          description={
            isReapply
              ? 'Проверьте данные отклонённой заявки и отправьте её снова.'
              : 'Заполните обязательные поля для отправки заявки на модерацию'
          }
          notice={
            isReapply && workspacesQuery.isError
              ? 'Не удалось загрузить предыдущую заявку. Заполните форму заново.'
              : undefined
          }
          submitLabel={isReapply ? 'Отправить снова' : 'Отправить на модерацию'}
          isPending={submitMutation.isPending}
          submitError={submitMutation.error}
          initialWorkspace={rejectedWorkspace}
          onSubmit={(payload) => submitMutation.mutate(payload)}
        />
      )}
    </Modal>
  );
}

export default BecomeLandlord;
