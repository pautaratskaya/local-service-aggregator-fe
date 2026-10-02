import { Navigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import WorkspaceForm from '../../components/WorkspaceForm';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { USER_ROLES } from '../../types/user';
import { useAddWorkspace } from './hooks/useAddWorkspace';

function AddWorkspace() {
  const { data: user, isLoading } = useCurrentUser();
  const addWorkspace = useAddWorkspace();

  if (isLoading) {
    return null;
  }

  if (!user?.roles.includes(USER_ROLES.LANDLORD)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Modal title="Добавить рабочее место">
      <WorkspaceForm
        description="Заполните данные нового рабочего места"
        submitLabel="Добавить рабочее место"
        isPending={addWorkspace.isPending}
        submitError={addWorkspace.error}
        onSubmit={(payload) => addWorkspace.mutate(payload)}
      />
    </Modal>
  );
}

export default AddWorkspace;
