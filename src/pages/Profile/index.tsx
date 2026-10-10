import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import {
  ROLE_APPLICATION_STATUSES,
  USER_ROLES,
  getUserRoleLabel,
  type UserRole,
} from '../../types/user';
import ProfileNotifications, { isUnreadDecision } from './ProfileNotifications';
import styles from './Profile.module.scss';
import { getLandlordStatusText, getMasterStatusText } from './statusText';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  const landlordApplication = user.landlordApplication ?? null;
  const masterApplication = user.masterApplication ?? null;
  const landlordStatusText = getLandlordStatusText(user.landlordRoleStatus);
  const masterStatusText = getMasterStatusText(user.masterRoleStatus);
  const landlordUnread = isUnreadDecision(landlordApplication);
  const masterUnread = isUnreadDecision(masterApplication);
  const roleLabels = user.roles
    .map((role) => getUserRoleLabel(role))
    .join(', ');

  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <h1>Профиль</h1>
        <dl className={styles.info}>
          <div className={styles.row}>
            <dt>Имя</dt>
            <dd>
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div className={styles.row}>
            <dt>Телефон</dt>
            <dd>{user.phone}</dd>
          </div>
          <div className={styles.row}>
            <dt>Роли</dt>
            <dd>{roleLabels}</dd>
          </div>
        </dl>
        <ProfileNotifications user={user} />
        <div className={styles.applications}>
          <ApplicationSection
            title="Арендодатель"
            statusText={landlordUnread ? '' : landlordStatusText}
            rejectReason={
              !landlordUnread &&
              landlordApplication?.status === ROLE_APPLICATION_STATUSES.REJECTED
                ? landlordApplication.rejectReason?.trim()
                : ''
            }
            canApply={canApplyForRole(
              user.roles,
              USER_ROLES.LANDLORD,
              user.landlordRoleStatus
            )}
            applyLabel={
              user.landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED
                ? 'Исправить заявку'
                : 'Стать арендодателем'
            }
            onApply={() =>
              navigate('/become-landlord', { state: { background: location } })
            }
            secondaryLabel={
              !landlordUnread &&
              user.landlordRoleStatus === ROLE_APPLICATION_STATUSES.APPROVED
                ? 'Перейти к моим рабочим местам'
                : undefined
            }
            onSecondary={
              !landlordUnread &&
              user.landlordRoleStatus === ROLE_APPLICATION_STATUSES.APPROVED
                ? () => navigate('/workspaces')
                : undefined
            }
          />
          <ApplicationSection
            title="Мастер"
            statusText={masterUnread ? '' : masterStatusText}
            rejectReason={
              !masterUnread &&
              masterApplication?.status === ROLE_APPLICATION_STATUSES.REJECTED
                ? masterApplication.rejectReason?.trim()
                : ''
            }
            canApply={canApplyForRole(
              user.roles,
              USER_ROLES.MASTER,
              user.masterRoleStatus
            )}
            applyLabel={
              user.masterRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED
                ? 'Исправить заявку'
                : 'Стать мастером'
            }
            onApply={() =>
              navigate('/become-master', { state: { background: location } })
            }
          />
        </div>
      </div>
    </div>
  );
}

function canApplyForRole(
  roles: UserRole[],
  role: UserRole,
  status: string
): boolean {
  return (
    !roles.includes(role) &&
    (status === ROLE_APPLICATION_STATUSES.NO ||
      status === ROLE_APPLICATION_STATUSES.REJECTED)
  );
}

function ApplicationSection({
  title,
  statusText,
  rejectReason,
  canApply,
  applyLabel,
  onApply,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  statusText: string;
  rejectReason?: string;
  canApply: boolean;
  applyLabel: string;
  onApply: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <section className={styles.application}>
      <h2>{title}</h2>
      {statusText && (
        <p className={styles.status}>
          {statusText}
          {rejectReason ? `. Причина: ${rejectReason}` : ''}
        </p>
      )}
      {secondaryLabel && onSecondary && (
        <Button type="button" onClick={onSecondary} cta>
          {secondaryLabel}
        </Button>
      )}
      {canApply && (
        <Button type="button" onClick={onApply} cta>
          {applyLabel}
        </Button>
      )}
    </section>
  );
}

export default Profile;
