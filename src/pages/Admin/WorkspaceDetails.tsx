import type {
  LandlordResponse,
  LandlordWorkspaceSummary,
} from '../../api/admin/listLandlords';
import { formatDateTime, formatOptional } from '../../helpers';
import {
  formatMinRent,
  formatTime,
  formatWorkingDays,
  formatWorkspaceStatus,
} from './formatApplication';
import styles from './Admin.module.scss';

type WorkspaceDetailsProps = {
  request: LandlordResponse;
  workspace: LandlordWorkspaceSummary;
};

function WorkspaceDetails({ request, workspace }: WorkspaceDetailsProps) {
  return (
    <dl className={styles.details}>
      <div>
        <dt>Имя пользователя</dt>
        <dd>{request.realName}</dd>
      </div>
      <div>
        <dt>Название помещения</dt>
        <dd>{workspace.name}</dd>
      </div>
      <div>
        <dt>Телефон</dt>
        <dd>{request.phone}</dd>
      </div>
      <div>
        <dt>Город</dt>
        <dd>{workspace.city}</dd>
      </div>
      <div>
        <dt>Адрес</dt>
        <dd>{workspace.address}</dd>
      </div>
      <div>
        <dt>Тип помещения</dt>
        <dd>{workspace.kind}</dd>
      </div>
      <div>
        <dt>Описание</dt>
        <dd>{workspace.description}</dd>
      </div>
      <div>
        <dt>Часы работы</dt>
        <dd>
          {formatTime(workspace.openTime)} – {formatTime(workspace.closeTime)}
        </dd>
      </div>
      <div>
        <dt>Рабочие дни</dt>
        <dd>{formatWorkingDays(workspace.workingDays)}</dd>
      </div>
      <div>
        <dt>Минимальная аренда</dt>
        <dd>{formatMinRent(workspace.minRentMinutes)}</dd>
      </div>
      <div>
        <dt>Цена за час</dt>
        <dd>{workspace.pricePerHour}</dd>
      </div>
      <div>
        <dt>Юр. название</dt>
        <dd>{formatOptional(workspace.legalName)}</dd>
      </div>
      <div>
        <dt>Рег. номер</dt>
        <dd>{formatOptional(workspace.legalRegistrationNo)}</dd>
      </div>
      <div>
        <dt>Реквизиты</dt>
        <dd>{formatOptional(workspace.legalDetails)}</dd>
      </div>
      <div>
        <dt>Статус</dt>
        <dd>{formatWorkspaceStatus(workspace.status)}</dd>
      </div>
      <div>
        <dt>Создано</dt>
        <dd>{formatDateTime(workspace.createdAt)}</dd>
      </div>
      {workspace.photos.length > 0 && (
        <div>
          <dt>Фото</dt>
          <dd>
            <ul className={styles.photos}>
              {[...workspace.photos]
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
    </dl>
  );
}

export default WorkspaceDetails;
