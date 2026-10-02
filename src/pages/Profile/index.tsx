import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ROLE_APPLICATION_STATUSES, USER_ROLES } from '../../types/user';
import styles from './Profile.module.scss';
import { getLandlordStatusText, getMasterStatusText } from './statusText';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  const landlordRoleStatus = user.landlordRoleStatus;
  const masterRoleStatus = user.masterRoleStatus;
  const landlordApplication = user.landlordApplication ?? null;
  const masterApplication = user.masterApplication ?? null;
  const landlordStatusText = landlordRoleStatus
    ? getLandlordStatusText(landlordRoleStatus)
    : '';
  const masterStatusText = masterRoleStatus
    ? getMasterStatusText(masterRoleStatus)
    : '';
  const landlordRejectReason =
    landlordApplication?.status === ROLE_APPLICATION_STATUSES.REJECTED
      ? landlordApplication.rejectReason?.trim()
      : '';
  const masterRejectReason =
    masterApplication?.status === ROLE_APPLICATION_STATUSES.REJECTED
      ? masterApplication.rejectReason?.trim()
      : '';

  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        {landlordStatusText !== ROLE_APPLICATION_STATUSES.NO && (
          <p className={styles.status}>
            {landlordStatusText}
            {landlordRejectReason ? `. Причина: ${landlordRejectReason}` : ''}
          </p>
        )}
        {masterStatusText !== ROLE_APPLICATION_STATUSES.NO && (
          <p className={styles.status}>
            {masterStatusText}
            {masterRejectReason ? `. Причина: ${masterRejectReason}` : ''}
          </p>
        )}
        <div className={styles.actions}>
          {!user.roles.includes(USER_ROLES.LANDLORD) &&
            (landlordRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
              landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED) && (
              <Button
                onClick={() =>
                  navigate('/become-landlord', {
                    state: { background: location },
                  })
                }
                cta
              >
                Стать арендодателем
              </Button>
            )}
          {!user.roles.includes(USER_ROLES.MASTER) &&
            (masterRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
              masterRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED) && (
              <Button
                onClick={() =>
                  navigate('/become-master', {
                    state: { background: location },
                  })
                }
                cta
              >
                Стать мастером
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
