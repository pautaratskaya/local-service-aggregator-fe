import { useEffect, useState } from 'react';
import ErrorIcon from '../../components/ErrorIcon';
import Spinner from '../../components/Spinner';
import SuccessIcon from '../../components/SuccessIcon';
import styles from './Login.module.scss';
import { delay } from '../../helpers';

interface LoginLoadingProps {
  onNext: () => void;
  isLoading: boolean;
  isError: boolean;
  successMessage?: string;
  errorMessage?: string;
  highlightedText?: string;
  messageDuration?: number;
}

function LoginLoading({
  onNext,
  isLoading,
  isError,
  successMessage = 'Готово!',
  errorMessage = 'Произошла ошибка',
  highlightedText,
  messageDuration = 1500,
}: LoginLoadingProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    const processAction = async () => {
      if (isLoading) return;

      setStatus(isError ? 'error' : 'success');

      // Show message before navigating
      await delay(messageDuration);
      onNext();
    };

    processAction();
  }, [onNext, isLoading, isError, messageDuration]);

  return (
    <div className={styles.login}>
      <div className={styles.centered}>
        {status === 'loading' && <Spinner />}
        {status === 'success' && (
          <SuccessIcon
            message={successMessage}
            highlightedText={highlightedText}
          />
        )}
        {status === 'error' && <ErrorIcon message={errorMessage} />}
      </div>
    </div>
  );
}

export default LoginLoading;
