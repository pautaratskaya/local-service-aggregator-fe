import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import PageLoader from '../../components/PageLoader';
import { PREMISE_STATUSES } from '../../api/admin/listLandlords';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import { findPremise } from './findPremise';
import WorkspaceForm from './WorkspaceForm';
import { useAddWorkspace } from './hooks/useAddWorkspace';

function AddWorkspace() {
  const { premiseId } = useParams();
  const premisesQuery = useLandlordPremises(true);
  const premise = findPremise(premisesQuery.data, premiseId);
  const addWorkspace = useAddWorkspace(premise?.id ?? 0);
  const canAdd = premise?.status === PREMISE_STATUSES.APPROVED;

  return (
    <Modal title="Добавить рабочее место">
        {premisesQuery.isLoading ? (
          <PageLoader />
        ) : !premise ? (
          <p>Помещение не найдено</p>
        ) : !canAdd ? (
          <p>Добавить рабочее место можно после одобрения помещения</p>
        ) : (
          <WorkspaceForm
            description="Рабочее место сразу станет активным. Название — это тип из каталога."
            submitLabel="Добавить рабочее место"
            isPending={addWorkspace.isPending}
            submitError={addWorkspace.error}
            onSubmit={(payload) => {
              if (!payload.photos?.length) {
                return;
              }

              addWorkspace.mutate({ ...payload, photos: payload.photos });
            }}
          />
        )}
    </Modal>
  );
}

export default AddWorkspace;
