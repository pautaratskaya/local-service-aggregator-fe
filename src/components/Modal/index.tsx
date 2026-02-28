import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';
import { useTextOverflow } from '../../hooks/useTextOverflow';
import { CrossIcon } from '../../icons';
import styles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ children, title }: ModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const showTooltip = useTextOverflow(titleRef, title);

  const handleClose = useCallback(() => {
    const background = location.state?.background;

    if (background) {
      navigate(background.pathname + background.search, { replace: true });
    } else {
      navigate('/');
    }
  }, [navigate, location]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2
            ref={titleRef}
            className={styles.modalTitle}
            title={showTooltip ? title : undefined}
          >
            {title}
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <CrossIcon />
          </button>
        </header>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
