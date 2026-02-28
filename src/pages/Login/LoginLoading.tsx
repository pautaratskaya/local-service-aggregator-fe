import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import SuccessIcon from '../../components/SuccessIcon';
import styles from './Login.module.scss';
import { delay } from '../../helpers';

interface LoginLoadingProps {
  onNext: () => void;
  successMessage?: string;
  highlightedText?: string;
  loadingDuration?: number;
  successDuration?: number;
}

function LoginLoading({
  onNext,
  successMessage = 'Готово!',
  highlightedText,
  loadingDuration = 2000,
  successDuration = 1500,
}: LoginLoadingProps) {
  // TODO: !!! add 'error' status
  const [status, setStatus] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    const processAction = async () => {
      try {
        // TODO: Replace with actual API request
        await delay(loadingDuration);

        setStatus('success');

        // Show success message before navigating
        await delay(successDuration);
        onNext();
      } catch (error) {
        console.error('Action failed:', error);
      }
    };

    processAction();
  }, [onNext, loadingDuration, successDuration]);

  return (
    <div className={styles.login}>
      <div className={styles.centered}>
        {status === 'loading' ? (
          <Spinner />
        ) : (
          <SuccessIcon
            message={successMessage}
            highlightedText={highlightedText}
          />
        )}
      </div>
    </div>
  );
}

export default LoginLoading;
