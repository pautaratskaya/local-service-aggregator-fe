import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import { useAuthStore } from '../../stores/authStore';
import { getUserRoleLabel, USER_ROLES } from '../../types/user';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = !!user;

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
            <div className={styles.actions}>
              {!user.roles.includes(USER_ROLES.LANDLORD) && (
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
