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
  onNext: (userData: { firstName: string; lastName: string }) => void;
  onBackToPhone: () => void;
}

function LoginName({ phone, onNext, onBackToPhone }: LoginNameProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const canSubmitInput = firstName.trim() && lastName.trim() && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmitInput) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.register({
        phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // TODO: review this
      // Save user data and token
      setAuth(
        {
          id: response.id,
          phone: response.phone,
          firstName: response.firstName,
          lastName: response.lastName,
          roles: response.roles,
          createdAt: response.createdAt,
        },
        response.token
      );

      onNext({ firstName: firstName.trim(), lastName: lastName.trim() });
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
  }, [canSubmitInput, firstName, lastName, phone, onNext, setAuth]);

  useEnterSubmit(handleSubmit);

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Как вас зовут?"
        description="Это имя увидят мастера и другие пользователи приложения"
      >
        <TextInput
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Введите имя"
          autoFocus
        />
        <TextInput
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Введите фамилию"
        />
        {error && <p className={styles.error}>{error}</p>}
      </IllustratedMessage>

      <footer>
        <p className={styles.info}>
          Профиль будет создан для номера{' '}
          <button className={styles.link} onClick={onBackToPhone}>
            {phone}
          </button>
        </p>
        <Button onClick={handleSubmit} cta disabled={!canSubmitInput}>
          {isSubmitting ? 'Регистрация...' : 'Завершить'}
        </Button>
      </footer>
    </div>
  );
}

export default LoginName;
