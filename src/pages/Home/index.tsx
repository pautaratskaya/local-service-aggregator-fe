import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import { useAuthStore } from '../../stores/authStore';
import { getUserRoleLabel, USER_ROLES } from '../../types/user';
import { landlordService } from '../../api/landlord/landlordService';
import { LANDLORD_APPLICATION_STATUSES } from '../../types/landlord';

function getLandlordStatusText(status: string): string {
  if (status === LANDLORD_APPLICATION_STATUSES.PENDING_REVIEW) {
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
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = !!user;
  const { data: landlordApplication } = useQuery({
    queryKey: ['landlord-application', user?.id],
    queryFn: () => landlordService.getMyApplication(user!.id),
    enabled: !!user,
  });
  const landlordStatusText = landlordApplication
    ? getLandlordStatusText(landlordApplication.status)
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
      {isLoggedIn && user && (
        <header className={styles.userHeader}>
          <div className={styles.rolesSection} aria-label="Роли пользователя">
            <span className={styles.rolesHeading}>Роли</span>
            <ul className={styles.rolesList}>
              {user.roles.map((role) => (
                <li key={role}>{getUserRoleLabel(role)}</li>
              ))}
            </ul>
          </div>
        </header>
      )}

      <div className={styles.mainContent}>
        {isLoggedIn ? (
          <>
            <h1>Привет, {user?.firstName}!</h1>
            {landlordStatusText && (
              <p className={styles.landlordStatus}>{landlordStatusText}</p>
            )}
            <div className={styles.actions}>
              {!user.roles.includes(USER_ROLES.LANDLORD) &&
                !landlordApplication && (
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
