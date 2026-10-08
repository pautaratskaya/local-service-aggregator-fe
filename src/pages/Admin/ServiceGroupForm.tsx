import CatalogDetailsForm from './CatalogDetailsForm';
import { useGetServiceGroup } from './hooks/useGetServiceGroup';
import { useUpdateServiceGroup } from './hooks/useUpdateServiceGroup';

type ServiceGroupFormProps = {
  id: number;
  onClose: () => void;
};

function ServiceGroupForm({ id, onClose }: ServiceGroupFormProps) {
  const { data, isLoading, isError, error } = useGetServiceGroup(id);
  const updateServiceGroup = useUpdateServiceGroup();

  return (
    <CatalogDetailsForm
      name={data?.name}
      description={data?.description}
      isLoading={isLoading}
      loadingMessage="Загружаем группу..."
      loadError={
        isError || (!isLoading && !data)
          ? error instanceof Error
            ? error.message
            : 'Не удалось загрузить группу'
          : undefined
      }
      isPending={updateServiceGroup.isPending}
      canSubmit={!!data}
      onCancel={onClose}
      onSubmit={(payload) => {
        updateServiceGroup.mutate({ id, payload }, { onSuccess: onClose });
      }}
    />
  );
}

export default ServiceGroupForm;
