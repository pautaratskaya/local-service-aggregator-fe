import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import AddCatalogItem from './AddCatalogItem';
import CatalogDetailsForm from './CatalogDetailsForm';
import CatalogDeleteDialog from './CatalogDeleteDialog';
import CatalogRow from './CatalogRow';
import ServiceGroupForm from './ServiceGroupForm';
import { useCatalogTree } from './hooks/useCatalogTree';
import { useCreateServiceGroup } from './hooks/useCreateServiceGroup';
import { useDeleteServiceGroup } from './hooks/useDeleteServiceGroup';
import styles from './Admin.module.scss';

function AdminCatalog() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCatalogTree();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: number;
    name: string;
    nested?: string;
  } | null>(null);
  const deleteServiceGroup = useDeleteServiceGroup();
  const createServiceGroup = useCreateServiceGroup();
  const groups = data ?? [];
  const waiting = isLoading || (isError && isFetching);

  return (
    <div className={styles.admin}>
      <h1>Каталог</h1>
      <p className={styles.catalogSection}>Группы услуг</p>
      {waiting ? (
        <PageLoader />
      ) : isError ? (
        <FetchErrorNotice
          message={
            error instanceof Error
              ? error.message
              : 'Не удалось загрузить каталог'
          }
          actionLabel="Повторить"
          onAction={() => {
            void refetch();
          }}
        />
      ) : (
        <>
          <AddCatalogItem
            label="Добавить группу"
            dismissKey={editingId}
            onOpen={() => setEditingId(null)}
          >
            {(onClose) => (
              <CatalogDetailsForm
                onCancel={onClose}
                isPending={createServiceGroup.isPending}
                onSubmit={(payload) => {
                  createServiceGroup.mutate(payload, { onSuccess: onClose });
                }}
              />
            )}
          </AddCatalogItem>
          {groups.length ? (
            <ul className={styles.catalog}>
              {groups.map((group) => (
                <CatalogRow
                  key={group.id}
                  name={group.name}
                  description={group.description}
                  onOpen={() => navigate(`/admin/catalog/${group.id}`)}
                  onEdit={() => setEditingId(group.id)}
                  deleteDisabled={deleteServiceGroup.isPending}
                  onDelete={() => {
                    setEditingId(null);
                    const hasTypes = group.workspaceTypes.length > 0;
                    const hasServices = group.workspaceTypes.some(
                      (workspaceType) => workspaceType.services.length > 0,
                    );

                    setGroupToDelete({
                      id: group.id,
                      name: group.name,
                      nested: hasTypes
                        ? hasServices
                          ? 'типы помещений и услуги'
                          : 'типы помещений'
                        : undefined,
                    });
                  }}
                >
                  {editingId === group.id && (
                    <ServiceGroupForm
                      id={group.id}
                      onClose={() => setEditingId(null)}
                    />
                  )}
                </CatalogRow>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Каталог пуст</p>
          )}
        </>
      )}
      {groupToDelete && (
        <CatalogDeleteDialog
          name={groupToDelete.name}
          nested={groupToDelete.nested}
          isPending={deleteServiceGroup.isPending}
          onCancel={() => setGroupToDelete(null)}
          onConfirm={() => {
            setEditingId(null);
            deleteServiceGroup.mutate(groupToDelete.id, {
              onSuccess: () => setGroupToDelete(null),
            });
          }}
        />
      )}
    </div>
  );
}

export default AdminCatalog;
