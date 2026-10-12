import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PREMISE_STATUSES } from '../../api/admin/listLandlords';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { formatDateTime } from '../../helpers';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import DeleteDialog from './DeleteDialog';
import { findPremise } from './findPremise';
import { useDeletePremise } from './hooks/useDeletePremise';
import PhotoViewer from './PhotoViewer';
import WorkspaceCard from './WorkspaceCard';
import styles from './Premises.module.scss';

function PremisePage() {
  const { premiseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const premisesQuery = useLandlordPremises(true);
  const deletePremise = useDeletePremise();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const premises = premisesQuery.data ?? [];
  const premise = findPremise(premisesQuery.data, premiseId);

  const closeDelete = () => {
    deletePremise.reset();
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
            : 'Не удалось загрузить помещение'
        }
        actionLabel="Повторить"
        onAction={() => {
          void premisesQuery.refetch();
        }}
      />
    );
  }

  if (!premise) {
    return (
      <div className={styles.premises}>
        <nav className={styles.breadcrumb}>
          <Link to="/premises">Мои помещения</Link>
        </nav>
        <p className={styles.empty}>Помещение не найдено</p>
      </div>
    );
  }

  const photos = [...premise.photos].sort((a, b) => a.order - b.order);
  const canAddWorkspace = premise.status === PREMISE_STATUSES.APPROVED;
  const wasLast = premises.length === 1;
  const hasLegal =
    Boolean(premise.legalName?.trim()) ||
    Boolean(premise.legalRegistrationNo?.trim()) ||
    Boolean(premise.legalDetails?.trim());

  return (
    <div className={styles.premises}>
      <div className={styles.premiseBody}>
        <nav className={styles.breadcrumb}>
          <Link to="/premises">Мои помещения</Link>
        </nav>
        <div className={styles.header}>
          <h1>{premise.name}</h1>
          <div className={styles.headerActions}>
            <Button
              type="button"
              className={styles.addButton}
              cta
              onClick={() =>
                navigate(`/edit-premise/${premise.id}`, {
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
        <section className={styles.about}>
          <p className={styles.place}>
            {premise.city}, {premise.address}
          </p>
          {premise.description?.trim() && (
            <p className={styles.description}>{premise.description}</p>
          )}
          {hasLegal && (
            <dl className={styles.legal}>
              {premise.legalName?.trim() && (
                <div>
                  <dt>Юр. название</dt>
                  <dd>{premise.legalName}</dd>
                </div>
              )}
              {premise.legalRegistrationNo?.trim() && (
                <div>
                  <dt>Рег. номер</dt>
                  <dd>{premise.legalRegistrationNo}</dd>
                </div>
              )}
              {premise.legalDetails?.trim() && (
                <div>
                  <dt>Реквизиты</dt>
                  <dd>{premise.legalDetails}</dd>
                </div>
              )}
            </dl>
          )}
          <p className={styles.created}>
            Создано {formatDateTime(premise.createdAt)}
          </p>
        </section>
        <div className={styles.workspaceBlock}>
          <div className={styles.workspaceHeader}>
            <h2>Рабочие места</h2>
            {canAddWorkspace && (
              <Button
                type="button"
                className={styles.addButton}
                cta
                onClick={() =>
                  navigate(`/add-workspace/${premise.id}`, {
                    state: { background: location },
                  })
                }
              >
                Добавить
              </Button>
            )}
          </div>
          {premise.workspaces.length > 0 ? (
            <ul className={styles.list}>
              {premise.workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  premiseId={premise.id}
                  workspace={workspace}
                />
              ))}
            </ul>
          ) : (
            <p className={styles.workspaceEmpty}>Рабочих мест пока нет</p>
          )}
        </div>
      </div>
      {photoIndex != null && (
        <PhotoViewer
          photos={photos}
          index={photoIndex}
          onClose={() => setPhotoIndex(null)}
          onIndex={setPhotoIndex}
        />
      )}
      {deleteOpen && (
        <DeleteDialog
          title={`Удалить «${premise.name}»?`}
          message="Удалятся и все рабочие места в нём. Если это последнее помещение, роль арендодателя снимется."
          isPending={deletePremise.isPending}
          error={deletePremise.error}
          onCancel={closeDelete}
          onConfirm={() =>
            deletePremise.mutate(
              { premiseId: premise.id, wasLast },
              {
                onSuccess: () => {
                  closeDelete();
                  if (!wasLast) {
                    navigate('/premises');
                  }
                },
              },
            )
          }
        />
      )}
    </div>
  );
}

export default PremisePage;
