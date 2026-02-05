import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';
import { useTextOverflow } from '../../hooks/useTextOverflow';
import styles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
}

const CloseIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.292734 0.292734C0.65885 -0.0733816 1.23785 -0.0959754 1.63063 0.224375L1.7068 0.292734L4.99977 3.5857L8.29273 0.292734L8.36891 0.224375C8.76168 -0.0959432 9.34069 -0.0733699 9.7068 0.292734C10.0727 0.658864 10.0954 1.23794 9.77516 1.63063L9.7068 1.7068L6.41383 4.99977L9.7068 8.29273L9.77516 8.36891C10.0953 8.76168 10.0728 9.34076 9.7068 9.7068C9.34076 10.0728 8.76168 10.0953 8.36891 9.77516L8.29273 9.7068L4.99977 6.41383L1.7068 9.7068L1.63063 9.77516C1.23794 10.0954 0.658864 10.0727 0.292734 9.7068C-0.0733764 9.34069 -0.0959612 8.76168 0.224375 8.36891L0.292734 8.29273L3.5857 4.99977L0.292734 1.7068L0.224375 1.63063C-0.0959754 1.23785 -0.0733816 0.65885 0.292734 0.292734Z"
      fill="#171819"
    />
  </svg>
);

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
            <CloseIcon />
          </button>
        </header>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
