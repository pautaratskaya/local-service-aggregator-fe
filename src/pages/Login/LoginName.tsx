import { useState, useCallback } from 'react';
import Button from '../../components/Button';
import IllustratedMessage from '../../components/IllustratedMessage';
import TextInput from '../../components/TextInput';
import useEnterSubmit from '../../hooks/useEnterSubmit';
import { authService } from '../../api/auth/authService';
import { AuthError } from '../../api/auth/types';
import { REGISTER_ERROR_TYPES } from '../../api/auth/register';
import { useAuthStore } from '../../stores/authStore';
import styles from './Login.module.scss';

interface LoginNameProps {
  phone: string;
  onNext: (userData: { name: string; surname: string }) => void;
}

function LoginName({ phone, onNext }: LoginNameProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const canSubmitInput = name.trim() && surname.trim() && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmitInput) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const realName = `${name.trim()} ${surname.trim()}`;
      const response = await authService.register({
        phone,
        realName,
      });

      // Save user data and token
      setAuth(
        {
          id: response.id,
          phone: response.phone,
          realName: response.realName,
          roles: response.roles,
          createdAt: response.createdAt,
        },
        response.token
      );

      onNext({ name: name.trim(), surname: surname.trim() });
    } catch (err) {
      if (err instanceof AuthError) {
        // Handle specific error types
        if (err.type === REGISTER_ERROR_TYPES.PHONE_ALREADY_REGISTERED) {
          setError('Этот номер уже зарегистрирован');
        } else {
          setError(err.message);
        }
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmitInput, name, surname, phone, onNext, setAuth]);

  useEnterSubmit(handleSubmit);

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Как вас зовут?"
        description="Это имя увидят мастера и другие пользователи приложения"
      >
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          autoFocus
        />
        <TextInput
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Введите фамилию"
        />
        {error && <p className={styles.error}>{error}</p>}
      </IllustratedMessage>

      <footer>
        <p className={styles.info}>
          Профиль будет создан для номера <a href={`tel:${phone}`}>{phone}</a>
        </p>
        <Button onClick={handleSubmit} cta disabled={!canSubmitInput}>
          {isSubmitting ? 'Регистрация...' : 'Завершить'}
        </Button>
      </footer>
    </div>
  );
}

export default LoginName;
