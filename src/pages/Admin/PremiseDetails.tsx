import type { LandlordResponse, Premise } from '../../api/admin/listLandlords';
import { formatDateTime, formatOptional } from '../../helpers';
import { formatPremiseStatus } from './formatApplication';
import styles from './Admin.module.scss';

type PremiseDetailsProps = {
  request: LandlordResponse;
  premise: Premise;
};

function PremiseDetails({ request, premise }: PremiseDetailsProps) {
  return (
    <dl className={styles.details}>
      <div>
        <dt>Имя пользователя</dt>
        <dd>{request.realName}</dd>
      </div>
      <div>
        <dt>Название помещения</dt>
        <dd>{premise.name}</dd>
      </div>
      <div>
        <dt>Телефон</dt>
        <dd>{request.phone}</dd>
      </div>
      <div>
        <dt>Город</dt>
        <dd>{premise.city}</dd>
      </div>
      <div>
        <dt>Адрес</dt>
        <dd>{premise.address}</dd>
      </div>
      <div>
        <dt>Описание</dt>
        <dd>{formatOptional(premise.description)}</dd>
      </div>
      <div>
        <dt>Юр. название</dt>
        <dd>{formatOptional(premise.legalName)}</dd>
      </div>
      <div>
        <dt>Рег. номер</dt>
        <dd>{formatOptional(premise.legalRegistrationNo)}</dd>
      </div>
      <div>
        <dt>Реквизиты</dt>
        <dd>{formatOptional(premise.legalDetails)}</dd>
      </div>
      <div>
        <dt>Согласие с условиями</dt>
        <dd>{formatDateTime(premise.termsAcceptedAt)}</dd>
      </div>
      <div>
        <dt>Статус</dt>
        <dd>{formatPremiseStatus(premise.status)}</dd>
      </div>
      <div>
        <dt>Создано</dt>
        <dd>{formatDateTime(premise.createdAt)}</dd>
      </div>
      {premise.photos.length > 0 && (
        <div>
          <dt>Фото</dt>
          <dd>
            <ul className={styles.photos}>
              {[...premise.photos]
                .sort((a, b) => a.order - b.order)
                .map((photo) => (
                  <li key={photo.id}>
                    <img src={photo.url} alt="" />
                  </li>
                ))}
            </ul>
          </dd>
        </div>
      )}
      {premise.workspaces.length > 0 && (
        <div>
          <dt>Рабочие места</dt>
          <dd>
            <ul className={styles.workspaceList}>
              {premise.workspaces.map((workspace) => (
                <li key={workspace.id}>
                  {workspace.kind} — {workspace.pricePerHour} за час, мин.{' '}
                  {workspace.minRentMinutes} мин
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}

export default PremiseDetails;
