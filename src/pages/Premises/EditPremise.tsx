import { useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import PageLoader from '../../components/PageLoader';
import PremiseForm from '../../components/PremiseForm';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import { findPremise } from './findPremise';
import { useUpdatePremise } from './hooks/useUpdatePremise';

function EditPremise() {
  const { premiseId } = useParams();
  const premisesQuery = useLandlordPremises(true);
  const premise = findPremise(premisesQuery.data, premiseId);
  const updatePremise = useUpdatePremise(premise?.id ?? 0);

  return (
    <Modal title="Изменить помещение">
      {premisesQuery.isLoading ? (
        <PageLoader />
      ) : !premise ? (
        <p>Помещение не найдено</p>
      ) : (
        <PremiseForm
          description="Измените данные помещения. Фото можно удалить или добавить новые. Должно остаться от 3 до 15."
          submitLabel="Сохранить"
          showTerms={false}
          initialPremise={premise}
          isPending={updatePremise.isPending}
          submitError={updatePremise.error}
          onSubmit={(payload) => updatePremise.mutate(payload)}
        />
      )}
    </Modal>
  );
}

export default EditPremise;
