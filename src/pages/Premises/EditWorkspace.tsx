import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import PageLoader from '../../components/PageLoader';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import { findWorkspace } from './findPremise';
import WorkspaceForm from './WorkspaceForm';
import { useUpdateWorkspace } from './hooks/useUpdateWorkspace';

function EditWorkspace() {
  const { workspaceId } = useParams();
  const premisesQuery = useLandlordPremises(true);
  const found = findWorkspace(premisesQuery.data, workspaceId);
  const updateWorkspace = useUpdateWorkspace(found?.workspace.id ?? 0);

  return (
    <Modal title="Изменить рабочее место">
      {premisesQuery.isLoading ? (
        <PageLoader />
      ) : !found ? (
        <p>Рабочее место не найдено</p>
      ) : (
        <WorkspaceForm
          description="Фото можно удалить или добавить новые. Должно остаться от 1 до 10. Услуги заменятся выбранными."
          submitLabel="Сохранить"
          initialWorkspace={found.workspace}
          isPending={updateWorkspace.isPending}
          submitError={updateWorkspace.error}
          onSubmit={(payload) => updateWorkspace.mutate(payload)}
        />
      )}
    </Modal>
  );
}

export default EditWorkspace;
