import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ActionsMenu from '../../components/ActionsMenu';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import PhotoScroller from '../../components/PhotoScroller';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import DeleteDialog from './DeleteDialog';
import { findWorkspace } from './findPremise';
import { useDeleteWorkspace } from './hooks/useDeleteWorkspace';
import PhotoViewer from '../../components/PhotoViewer';
import styles from './Premises.module.scss';

function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const premisesQuery = useLandlordPremises(true);
  const deleteWorkspace = useDeleteWorkspace();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const found = findWorkspace(premisesQuery.data, workspaceId);

  const closeDelete = () => {
    deleteWorkspace.reset();
    setDeleteOpen(false);
  };

  if (
    premisesQuery.isLoading ||
    (premisesQuery.isError && premisesQuery.isFetching)
  ) {
    return <PageLoader />;
  }

  if (premisesQuery.isError) {
    return (
      <FetchErrorNotice
        message={
          premisesQuery.error instanceof Error
            ? premisesQuery.error.message
            : 'Не удалось загрузить рабочее место'
        }
        actionLabel="Повторить"
        onAction={() => {
          void premisesQuery.refetch();
        }}
      />
    );
  }

  if (!found) {
    return (
      <div className={styles.premises}>
        <nav className={styles.breadcrumb}>
          <Link to="/premises">Мои помещения</Link>
        </nav>
        <p className={styles.empty}>Рабочее место не найдено</p>
      </div>
    );
  }

  const { premise, workspace } = found;
  const photos = [...workspace.photos].sort((a, b) => a.order - b.order);

  return (
    <div className={`${styles.premises} ${styles.workspaceView}`}>
      <nav className={styles.breadcrumb}>
        <Link to="/premises">Мои помещения</Link>
        <span> / </span>
        <Link to={`/premises/${premise.id}`}>{premise.name}</Link>
      </nav>
      <PhotoScroller
        photos={photos}
        className={`${styles.stage} ${photos.length > 1 ? styles.swipeable : ''}`}
        onActivate={(index) => {
          if (photos.length > 0) {
            setViewerIndex(index);
          }
        }}
      >
        {({ index, scrollTo }) => (
          <>
            {photos.length > 1 && (
              <span className={styles.dashes}>
                {photos.map((photo, photoIndex) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={photoIndex === index ? styles.active : undefined}
                    aria-label={`Фото ${photoIndex + 1}`}
                    aria-current={photoIndex === index ? 'true' : undefined}
                    onClick={() => scrollTo(photoIndex)}
                  />
                ))}
              </span>
            )}
            {photos.length > 0 && (
              <span className={styles.photoCount}>{photos.length}</span>
            )}
            <ActionsMenu
              items={[
                {
                  label: 'Изменить',
                  onSelect: () =>
                    navigate(`/edit-workspace/${workspace.id}`, {
                      state: { background: location },
                    }),
                },
                {
                  label: 'Удалить',
                  onSelect: () => setDeleteOpen(true),
                },
              ]}
            />
          </>
        )}
      </PhotoScroller>
      <section className={styles.sheet}>
        <h1>{workspace.kind}</h1>
        {workspace.description?.trim() && (
          <p className={styles.description}>{workspace.description}</p>
        )}
        <p className={styles.facts}>
          <span>{workspace.pricePerHour} Br/час</span>
          <span>от {workspace.minRentMinutes} мин</span>
        </p>
      </section>
      {viewerIndex != null && (
        <PhotoViewer
          photos={photos.map((photo) => ({ src: photo.url }))}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onIndex={setViewerIndex}
        />
      )}
      {deleteOpen && (
        <DeleteDialog
          title={`Удалить «${workspace.kind}»?`}
          message="Роль арендодателя сохранится."
          isPending={deleteWorkspace.isPending}
          error={deleteWorkspace.error}
          onCancel={closeDelete}
          onConfirm={() =>
            deleteWorkspace.mutate(workspace.id, {
              onSuccess: () => {
                closeDelete();
                navigate(`/premises/${premise.id}`);
              },
            })
          }
        />
      )}
    </div>
  );
}

export default WorkspacePage;
