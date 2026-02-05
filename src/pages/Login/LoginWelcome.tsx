import Button from '../../components/Button';
import IllustratedMessage from '../../components/IllustratedMessage';
import useEnterSubmit from '../../hooks/useEnterSubmit';
import styles from './Login.module.scss';
import profileIcon from '../../assets/images/profile.png';

interface LoginWelcomeProps {
  onNext: () => void;
}

function LoginWelcome({ onNext }: LoginWelcomeProps) {
  useEnterSubmit(onNext);
  return (
    <div className={styles.login}>
      <IllustratedMessage
        centered
        image={profileIcon}
        imageAlt="profile icon"
        title="Войдите в профиль"
        description="Чтобы открыть доступ ко всем функциям приложения"
      />

      <footer>
        <Button onClick={onNext} cta>
          Войти
        </Button>
      </footer>
    </div>
  );
}

export default LoginWelcome;
