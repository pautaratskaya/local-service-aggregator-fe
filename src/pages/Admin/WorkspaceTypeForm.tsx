import CatalogDetailsForm from './CatalogDetailsForm';
import { useGetWorkspaceType } from './hooks/useGetWorkspaceType';
import { useUpdateWorkspaceType } from './hooks/useUpdateWorkspaceType';

type WorkspaceTypeFormProps = {
  id: number;
  onClose: () => void;
};

function WorkspaceTypeForm({ id, onClose }: WorkspaceTypeFormProps) {
  const { data, isLoading, isError, error } = useGetWorkspaceType(id);
  const updateWorkspaceType = useUpdateWorkspaceType();

  return (
    <CatalogDetailsForm
      name={data?.name}
      description={data?.description}
      isLoading={isLoading}
      loadingMessage="Загружаем тип помещения..."
      loadError={
        isError || (!isLoading && !data)
          ? error instanceof Error
            ? error.message
            : 'Не удалось загрузить тип помещения'
          : undefined
      }
      isPending={updateWorkspaceType.isPending}
      canSubmit={!!data}
      onCancel={onClose}
      onSubmit={(payload) => {
        if (!data) {
          return;
        }

        updateWorkspaceType.mutate(
          {
            id,
            payload: { ...payload, shared: data.shared },
          },
          { onSuccess: onClose },
        );
      }}
    />
  );
}

export default WorkspaceTypeForm;
