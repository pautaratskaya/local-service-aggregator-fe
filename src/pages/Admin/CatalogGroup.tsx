import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import AddCatalogItem from './AddCatalogItem';
import CatalogDeleteDialog, {
  type CatalogDeleteKind,
} from './CatalogDeleteDialog';
import CatalogDetailsForm from './CatalogDetailsForm';
import CatalogRow from './CatalogRow';
import ServiceItemForm, { CreateServiceItemForm } from './ServiceItemForm';
import WorkspaceTypeForm from './WorkspaceTypeForm';
import { useCatalogTree } from './hooks/useCatalogTree';
import { useDeleteServiceItem } from './hooks/useDeleteServiceItem';
import { useCreateWorkspaceType } from './hooks/useCreateWorkspaceType';
import { useDeleteWorkspaceType } from './hooks/useDeleteWorkspaceType';
import styles from './Admin.module.scss';

function AdminCatalogGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCatalogTree();
  const [openTypeId, setOpenTypeId] = useState<number | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
    kind: 'type' | 'service';
    cascade?: CatalogDeleteKind;
  } | null>(null);
  const deleteServiceItem = useDeleteServiceItem();
  const deleteWorkspaceType = useDeleteWorkspaceType();
  const createWorkspaceType = useCreateWorkspaceType();
  const group = data?.find((item) => String(item.id) === groupId);
  const waiting = isLoading || (isError && isFetching);

  const backToCatalog = (
    <button
      type="button"
      className={styles.catalogBack}
      onClick={() => navigate('/admin/catalog')}
    >
      Каталог
    </button>
  );

  if (waiting || isError || !group) {
    return (
      <div className={styles.admin}>
        {backToCatalog}
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
          <p className={styles.empty}>Группа не найдена</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      {backToCatalog}
      <AddCatalogItem
        label="Добавить тип помещения"
        dismissKey={openTypeId ?? editingTypeId}
        onOpen={() => {
          setOpenTypeId(null);
          setEditingTypeId(null);
          setEditingServiceId(null);
        }}
        form={(onClose) => (
          <CatalogDetailsForm
            onCancel={onClose}
            isPending={createWorkspaceType.isPending}
            onSubmit={(payload) => {
              createWorkspaceType.mutate(
                {
                  groupId: group.id,
                  payload: { ...payload, shared: false },
                },
                { onSuccess: onClose },
              );
            }}
          />
        )}
      >
        {({ button, form }) => (
          <>
            <div className={styles.header}>
              <h1>{group.name}</h1>
              {button}
            </div>
            <p className={styles.catalogSection}>Типы помещений</p>
            {form}
            {group.workspaceTypes.length ? (
        <ul className={styles.catalog}>
          {group.workspaceTypes.map((workspaceType) => {
            const isOpen = openTypeId === workspaceType.id;

            return (
              <CatalogRow
                key={workspaceType.id}
                name={workspaceType.name}
                description={workspaceType.description}
                open={isOpen}
                onOpen={() => {
                  setEditingTypeId(null);
                  setEditingServiceId(null);
                  setOpenTypeId(isOpen ? null : workspaceType.id);
                }}
                onEdit={() => {
                  setOpenTypeId(null);
                  setEditingServiceId(null);
                  setEditingTypeId(workspaceType.id);
                }}
                deleteDisabled={deleteWorkspaceType.isPending}
                onDelete={() => {
                  setEditingTypeId(null);
                  setEditingServiceId(null);
                  setItemToDelete({
                    id: workspaceType.id,
                    name: workspaceType.name,
                    kind: 'type',
                    cascade:
                      workspaceType.services.length > 0
                        ? 'services'
                        : undefined,
                  });
                }}
              >
                {editingTypeId === workspaceType.id && (
                  <WorkspaceTypeForm
                    id={workspaceType.id}
                    onClose={() => setEditingTypeId(null)}
                  />
                )}
                {isOpen && (
                  <div className={styles.catalogServices}>
                    <AddCatalogItem
                      label="Добавить услугу"
                      dismissKey={editingServiceId}
                      onOpen={() => setEditingServiceId(null)}
                      form={(onClose) => (
                        <CreateServiceItemForm
                          workspaceTypeId={workspaceType.id}
                          onClose={onClose}
                        />
                      )}
                    >
                      {({ button, form }) => (
                        <>
                          {button}
                          {form}
                    {workspaceType.services.length ? (
                      <ul>
                        {workspaceType.services.map((service) => (
                          <CatalogRow
                            key={service.id}
                            name={service.name}
                            description={service.description}
                            onEdit={() => setEditingServiceId(service.id)}
                            deleteDisabled={deleteServiceItem.isPending}
                            onDelete={() => {
                              setEditingServiceId(null);
                              setItemToDelete({
                                id: service.id,
                                name: service.name,
                                kind: 'service',
                              });
                            }}
                          >
                            {editingServiceId === service.id && (
                              <ServiceItemForm
                                id={service.id}
                                onClose={() => setEditingServiceId(null)}
                              />
                            )}
                          </CatalogRow>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.empty}>Услуг нет</p>
                    )}
                        </>
                      )}
                    </AddCatalogItem>
                  </div>
                )}
              </CatalogRow>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Типов помещений нет</p>
            )}
          </>
        )}
      </AddCatalogItem>
      {itemToDelete && (
        <CatalogDeleteDialog
          name={itemToDelete.name}
          kind={itemToDelete.cascade}
          isPending={
            deleteWorkspaceType.isPending || deleteServiceItem.isPending
          }
          onCancel={() => setItemToDelete(null)}
          onConfirm={() => {
            const target = itemToDelete;

            if (target.kind === 'type') {
              setEditingTypeId(null);
              setEditingServiceId(null);
              if (openTypeId === target.id) {
                setOpenTypeId(null);
              }
              deleteWorkspaceType.mutate(target.id, {
                onSuccess: () => setItemToDelete(null),
              });
              return;
            }

            setEditingServiceId(null);
            deleteServiceItem.mutate(target.id, {
              onSuccess: () => setItemToDelete(null),
            });
          }}
        />
      )}
    </div>
  );
}

export default AdminCatalogGroup;
