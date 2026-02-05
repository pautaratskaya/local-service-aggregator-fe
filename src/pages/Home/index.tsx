import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import Button from '../../components/Button';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const onLoginClick = () => {
    navigate('/login', { state: { background: location } });
  };

  return (
    <div className={styles.home}>
      <h1>HUIALDBERIZ HOME PAGE</h1>
      <Button onClick={onLoginClick} cta>
        Войти
      </Button>
    </div>
  );
}

export default Home;
