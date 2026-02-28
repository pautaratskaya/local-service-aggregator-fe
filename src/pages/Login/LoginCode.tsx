import { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button';
import CodeInput from '../../components/CodeInput';
import IllustratedMessage from '../../components/IllustratedMessage';
import { formatPhoneNumber } from '../../components/PhoneInput/helpers';
import { formatSecondsToTime } from '../../helpers';
import useEnterSubmit from '../../hooks/useEnterSubmit';
import styles from './Login.module.scss';
import { authService } from '../../api/auth/authService';
import { AuthError } from '../../api/auth/types';
import { LOGIN_ERROR_TYPES } from '../../api/auth/login';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types/user';

const CODE_LENGTH = 6;
const RESEND_CODE_TIMER = 60;

export type LoginNextPayload =
  | { isExistingUser?: false }
  | { isExistingUser: true; roles: UserRole[] };

interface LoginCodeProps {
  onNext: (payload: LoginNextPayload) => void;
  onBack: () => void;
  phone: string;
}

function LoginCode({ onNext, onBack, phone }: LoginCodeProps) {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(RESEND_CODE_TIMER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const formattedPhone = formatPhoneNumber(phone);
  const canSubmitCode =
    code.length === CODE_LENGTH && timeLeft > 0 && !isSubmitting;

  // Timer countdown for resend code
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Automatically submit when code is complete
  useEffect(() => {
    if (canSubmitCode) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Clear error when user changes code
  useEffect(() => {
    if (error) {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleResendCode = () => {
    // TODO: Implement code resend
    setTimeLeft(RESEND_CODE_TIMER);
  };

  const handleLoginError = useCallback(
    (err: unknown) => {
      if (err instanceof AuthError) {
        // Handle specific error types
        if (err.type === LOGIN_ERROR_TYPES.USER_NOT_FOUND) {
          onNext({ isExistingUser: false });
        } else {
          setError(err.message);
        }
      } else {
        setError('Произошла неизвестная ошибка');
      }
    },
    [code, onNext]
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmitCode) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.login({
        phone,
        code,
      });

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

      onNext({ isExistingUser: true, roles: response.roles });
    } catch (err) {
      handleLoginError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmitCode, phone, code, setAuth, handleLoginError, onNext]);

  useEnterSubmit(handleSubmit);

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Введите код из смс"
        description={
          <>
            Мы отправили сообщение на номер{' '}
            <button className={styles.link} onClick={onBack}>
              {formattedPhone}
            </button>
          </>
        }
      >
        <CodeInput length={CODE_LENGTH} onChange={setCode} />
        {error && <p className={styles.error}>{error}</p>}
        {timeLeft > 0 ? (
          <p className={styles.info}>
            Отправить код ещё раз через {formatSecondsToTime(timeLeft)}
          </p>
        ) : (
          <p className={styles.info}>
            <button onClick={handleResendCode} className={styles.resendButton}>
              Отправить код ещё раз
            </button>
          </p>
        )}
      </IllustratedMessage>

      <footer>
        <Button onClick={handleSubmit} cta disabled={!canSubmitCode}>
          {isSubmitting ? 'Проверка...' : 'Войти'}
        </Button>
      </footer>
    </div>
  );
}

export default LoginCode;
