import Modal from '../../components/Modal';
import PremiseForm from '../../components/PremiseForm';
import { useAddPremise } from './hooks/useAddPremise';

function AddPremise() {
  const addPremise = useAddPremise();

  return (
    <Modal title="Добавить помещение">
      <PremiseForm
        description="Заполните данные нового помещения"
        submitLabel="Добавить помещение"
        showTerms={false}
        isPending={addPremise.isPending}
        submitError={addPremise.error}
        onSubmit={(payload) => addPremise.mutate(payload)}
      />
    </Modal>
  );
}

export default AddPremise;
