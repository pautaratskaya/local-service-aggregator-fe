import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PREMISE_STATUSES } from '../../api/admin/listLandlords';
import ActionsMenu from '../../components/ActionsMenu';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import PhotoScroller from '../../components/PhotoScroller';
import { formatDateTime } from '../../helpers';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import DeleteDialog from './DeleteDialog';
import { findPremise } from './findPremise';
import { useDeletePremise } from './hooks/useDeletePremise';
import PhotoViewer from '../../components/PhotoViewer';
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
    <div className={`${styles.premises} ${styles.premiseView}`}>
      <nav className={styles.breadcrumb}>
        <Link to="/premises">Мои помещения</Link>
      </nav>
      <PhotoScroller
        photos={photos}
        className={`${styles.stage} ${photos.length > 1 ? styles.swipeable : ''}`}
        onActivate={(index) => {
          if (photos.length > 0) {
            setPhotoIndex(index);
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
                    navigate(`/edit-premise/${premise.id}`, {
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
        <h1>{premise.name}</h1>
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
      </section>
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
