import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { formatOptional } from '../../helpers';
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
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
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
    <div className={styles.premises}>
      <nav className={styles.breadcrumb}>
        <Link to="/premises">Мои помещения</Link>
        <span> / </span>
        <Link to={`/premises/${premise.id}`}>{premise.name}</Link>
      </nav>
      <div className={styles.header}>
        <h1>{workspace.kind}</h1>
        <div className={styles.headerActions}>
          <Button
            type="button"
            className={styles.addButton}
            cta
            onClick={() =>
              navigate(`/edit-workspace/${workspace.id}`, {
                state: { background: location },
              })
            }
          >
            Изменить
          </Button>
          <Button
            type="button"
            className={styles.addButton}
            cta
            onClick={() => setDeleteOpen(true)}
          >
            Удалить
          </Button>
        </div>
      </div>
      {photos.length > 0 && (
        <ul
          className={`${styles.gallery} ${photos.length === 1 ? styles.solo : ''}`}
        >
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className={index === 0 ? styles.hero : undefined}
            >
              <button
                type="button"
                aria-label={`Открыть фото ${index + 1}`}
                onClick={() => setPhotoIndex(index)}
              >
                <img src={photo.url} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <dl className={styles.details}>
        <div>
          <dt>Тип</dt>
          <dd>{workspace.kind}</dd>
        </div>
        <div>
          <dt>Описание</dt>
          <dd>{formatOptional(workspace.description)}</dd>
        </div>
        <div>
          <dt>Цена аренды за час</dt>
          <dd>{workspace.pricePerHour}</dd>
        </div>
        <div>
          <dt>Минимальное время аренды</dt>
          <dd>{workspace.minRentMinutes} мин</dd>
        </div>
      </dl>
      {photoIndex != null && (
        <PhotoViewer
          photos={photos.map((photo) => ({ src: photo.url }))}
          index={photoIndex}
          onClose={() => setPhotoIndex(null)}
          onIndex={setPhotoIndex}
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
