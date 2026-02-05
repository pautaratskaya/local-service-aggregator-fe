import { useState, useCallback } from 'react';
import Button from '../../components/Button';
import IllustratedMessage from '../../components/IllustratedMessage';
import PhoneInput from '../../components/PhoneInput';
import styles from './Login.module.scss';
import { PREFIX, MAX_DIGITS } from '../../components/PhoneInput/helpers';
import useEnterSubmit from '../../hooks/useEnterSubmit';
import { authService } from '../../api/auth/authService';
import { AuthError } from '../../api/auth/types';

interface LoginPhoneProps {
  onNext: (phone: string) => void;
  initialPhone: string;
}

function LoginPhone({ onNext, initialPhone }: LoginPhoneProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPhoneValid =
    phone.length === PREFIX.length + MAX_DIGITS && phone.startsWith(PREFIX);

  const handleSubmit = useCallback(async () => {
    if (!isPhoneValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await authService.requestCode({ phone });
      onNext(phone);
    } catch (err) {
      setError(
        err instanceof AuthError ? err.message : 'Произошла неизвестная ошибка'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isPhoneValid, isSubmitting, onNext, phone]);

  useEnterSubmit(handleSubmit);

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Введите номер телефона"
        description="Мы отправим на него смс с кодом подтверждения"
      >
        <PhoneInput initialValue={initialPhone} onChange={setPhone} autoFocus />
        {error && <p className={styles.error}>{error}</p>}
      </IllustratedMessage>

      <footer>
        {/* TODO: Add terms of service links */}
        <p>
          Нажимая Продолжить, я соглашаюсь с{' '}
          <a href="#">пользовательским соглашением</a>,{' '}
          <a href="#">политикой конфиденциальности</a> и <a href="#">офертой</a>
        </p>
        <Button
          onClick={handleSubmit}
          cta
          disabled={!isPhoneValid || isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Продолжить'}
        </Button>
      </footer>
    </div>
  );
}

export default LoginPhone;
