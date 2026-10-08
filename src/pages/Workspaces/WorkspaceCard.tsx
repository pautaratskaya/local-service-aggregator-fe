import type { LandlordWorkspaceSummary } from '../../api/admin/listLandlords';
import { useWorkspaceTypes } from '../../hooks/useWorkspaceTypes';
import { TriangleDownIcon } from '../../icons';
import { formatDateTime, formatOptional } from '../../helpers';
import {
  formatMinRent,
  formatTime,
  formatWorkingDays,
} from '../Admin/formatApplication';
import styles from './Workspaces.module.scss';

type WorkspaceCardProps = {
  workspace: LandlordWorkspaceSummary;
  isExpanded: boolean;
  onToggle: () => void;
};

function WorkspaceCard({ workspace, isExpanded, onToggle }: WorkspaceCardProps) {
  const { data: workspaceTypes = [] } = useWorkspaceTypes();
  const workspaceTypeName =
    workspaceTypes.find((type) => type.id === workspace.workspaceTypeId)
      ?.workspaceName ?? '';
  const photos = [...workspace.photos].sort((a, b) => a.order - b.order);

  return (
    <li className={styles.item}>
      <div
        className={styles.row}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <span className={styles.summary}>
          {workspace.name} ({workspace.address})
        </span>
        <span
          className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
          aria-hidden
        >
          <TriangleDownIcon />
        </span>
      </div>
      {isExpanded && (
        <dl className={styles.details}>
          <div>
            <dt>Название рабочего места</dt>
            <dd>{workspace.name}</dd>
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
            <dt>Тип рабочего места</dt>
            <dd>{workspaceTypeName}</dd>
          </div>
          <div>
            <dt>Описание</dt>
            <dd>{workspace.description}</dd>
          </div>
          <div>
            <dt>Часы работы</dt>
            <dd>
              {formatTime(workspace.openTime)} –{' '}
              {formatTime(workspace.closeTime)}
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
            <dt>Создано</dt>
            <dd>{formatDateTime(workspace.createdAt)}</dd>
          </div>
          {photos.length > 0 && (
            <div>
              <dt>Фото</dt>
              <dd>
                <ul className={styles.photos}>
                  {photos.map((photo) => (
                    <li key={photo.id}>
                      <img src={photo.url} alt="" />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      )}
    </li>
  );
}

export default WorkspaceCard;
