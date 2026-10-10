import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import AddCatalogItem from './AddCatalogItem';
import CatalogDetailsForm from './CatalogDetailsForm';
import CatalogDeleteDialog, {
  type CatalogDeleteKind,
} from './CatalogDeleteDialog';
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
    kind?: CatalogDeleteKind;
  } | null>(null);
  const deleteServiceGroup = useDeleteServiceGroup();
  const createServiceGroup = useCreateServiceGroup();
  const groups = data ?? [];
  const waiting = isLoading || (isError && isFetching);

  useEffect(() => {
    if (groupToDelete) {
      return;
    }

    deleteServiceGroup.reset();
  }, [groupToDelete, deleteServiceGroup.reset]);

  return (
    <div className={styles.admin}>
      <AddCatalogItem
        label="Добавить группу"
        dismissKey={editingId}
        onOpen={() => setEditingId(null)}
        form={(onClose) => (
          <CatalogDetailsForm
            onCancel={onClose}
            isPending={createServiceGroup.isPending}
            onSubmit={(payload) => {
              createServiceGroup.mutate(payload, { onSuccess: onClose });
            }}
          />
        )}
      >
        {({ button, form }) => (
          <>
            <div className={styles.header}>
              <h1>Каталог</h1>
              {!waiting && !isError && button}
            </div>
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
                {form}
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
                            (workspaceType) => workspaceType.services.length > 0
                          );

                          setGroupToDelete({
                            id: group.id,
                            name: group.name,
                            kind: hasTypes
                              ? hasServices
                                ? 'typesAndServices'
                                : 'types'
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
          </>
        )}
      </AddCatalogItem>
      {groupToDelete && (
        <CatalogDeleteDialog
          name={groupToDelete.name}
          kind={groupToDelete.kind}
          isPending={deleteServiceGroup.isPending}
          error={deleteServiceGroup.error}
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
