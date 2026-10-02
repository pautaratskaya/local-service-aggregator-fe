import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import UserRoles from '../../components/UserRoles';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const isLoggedIn = !!user;

  const onLoginClick = () => {
    navigate('/login', { state: { background: location } });
  };

  return (
    <div className={styles.home}>
      <div className={styles.mainContent}>
        {isLoggedIn ? (
          <>
            <h1>Привет, {user.firstName}!</h1>
            <UserRoles roles={user.roles} />
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
