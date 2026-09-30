import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import { useAuthStore } from '../../stores/authStore';
import { USER_ROLES } from '../../types/user';
import { LANDLORD_APPLICATION_STATUSES } from '../../types/landlord';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function getLandlordStatusText(status: string): string {
  if (status === LANDLORD_APPLICATION_STATUSES.WAITING_APPROVAL) {
    return 'Ваша заявка на создание помещения принята и находится в статусе На рассмотрении';
  }
  if (status === LANDLORD_APPLICATION_STATUSES.APPROVED) {
    return 'Ваша заявка арендодателя одобрена';
  }
  if (status === LANDLORD_APPLICATION_STATUSES.REJECTED) {
    return 'Ваша заявка арендодателя отклонена';
  }
  return '';
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const { data: user } = useCurrentUser();
  const isLoggedIn = !!user;

  const landlordRoleStatus = user?.landlordRoleStatus;
  const landlordStatusText = landlordRoleStatus
    ? getLandlordStatusText(landlordRoleStatus)
    : '';

  const onLoginClick = () => {
    navigate('/login', { state: { background: location } });
  };

  const onLogoutClick = () => {
    logout();
    navigate('/');
  };

  const onBecomeLandlordClick = () => {
    navigate('/become-landlord', { state: { background: location } });
  };

  const onBecomeMasterClick = () => {
    // TODO: Implement become master logic
    console.log('===> become master');
  };

  return (
    <div className={styles.home}>
      <div className={styles.mainContent}>
        {isLoggedIn ? (
          <>
            <h1>Привет, {user.firstName}!</h1>
            {landlordStatusText !== LANDLORD_APPLICATION_STATUSES.NO && (
              <p className={styles.landlordStatus}>{landlordStatusText}</p>
            )}
            <div className={styles.actions}>
              {!user.roles.includes(USER_ROLES.LANDLORD) &&
                (landlordRoleStatus === LANDLORD_APPLICATION_STATUSES.NO ||
                  landlordRoleStatus ===
                    LANDLORD_APPLICATION_STATUSES.REJECTED) && (
                  <Button onClick={onBecomeLandlordClick} cta>
                    Стать арендодателем
                  </Button>
                )}
              {!user.roles.includes(USER_ROLES.MASTER) && (
                <Button onClick={onBecomeMasterClick} disabled cta>
                  Стать мастером
                </Button>
              )}
              <Button onClick={onLogoutClick} cta>
                Выйти
              </Button>
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
