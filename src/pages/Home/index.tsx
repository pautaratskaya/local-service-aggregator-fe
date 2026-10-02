import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import UserRoles from '../../components/UserRoles';
import { ROLE_APPLICATION_STATUSES, USER_ROLES } from '../../types/user';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getLandlordStatusText, getMasterStatusText } from './statusText';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const isLoggedIn = !!user;

  const landlordRoleStatus = user?.landlordRoleStatus;
  const masterRoleStatus = user?.masterRoleStatus;
  const landlordApplication = user?.landlordApplication ?? null;
  const masterApplication = user?.masterApplication ?? null;
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

  const onLoginClick = () => {
    navigate('/login', { state: { background: location } });
  };

  const onBecomeLandlordClick = () => {
    navigate('/become-landlord', { state: { background: location } });
  };

  const onBecomeMasterClick = () => {
    navigate('/become-master', { state: { background: location } });
  };

  return (
    <div className={styles.home}>
      <div className={styles.mainContent}>
        {isLoggedIn ? (
          <>
            <h1>Привет, {user.firstName}!</h1>
            <UserRoles roles={user.roles} />
            {landlordStatusText !== ROLE_APPLICATION_STATUSES.NO && (
              <p className={styles.landlordStatus}>
                {landlordStatusText}
                {landlordRejectReason ? `. Причина: ${landlordRejectReason}` : ''}
              </p>
            )}
            {masterStatusText !== ROLE_APPLICATION_STATUSES.NO && (
              <p className={styles.landlordStatus}>
                {masterStatusText}
                {masterRejectReason ? `. Причина: ${masterRejectReason}` : ''}
              </p>
            )}
            <div className={styles.actions}>
              {!user.roles.includes(USER_ROLES.LANDLORD) &&
                (landlordRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
                  landlordRoleStatus ===
                    ROLE_APPLICATION_STATUSES.REJECTED) && (
                  <Button onClick={onBecomeLandlordClick} cta>
                    Стать арендодателем
                  </Button>
                )}
              {!user.roles.includes(USER_ROLES.MASTER) &&
                (masterRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
                  masterRoleStatus ===
                    ROLE_APPLICATION_STATUSES.REJECTED) && (
                  <Button onClick={onBecomeMasterClick} cta>
                    Стать мастером
                  </Button>
                )}
            </div>
          </>
        ) : (
          <>
            <h1>HUIALDBERIZ HOME PAGE</h1>
            <Button onClick={onLoginClick} cta>
              Войти
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
