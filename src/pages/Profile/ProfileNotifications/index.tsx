import { useEffect, useRef, useState } from 'react';
import { formatDateTime } from '../../../helpers';
import {
  ROLE_APPLICATION_STATUSES,
  type RoleApplication,
  type User,
} from '../../../types/user';
import { useMarkRoleNotificationRead } from '../hooks/useMarkRoleNotificationRead';
import { getLandlordStatusText, getMasterStatusText } from '../statusText';
import styles from './ProfileNotifications.module.scss';

export function isUnreadDecision(application: RoleApplication | null): boolean {
  if (!application || application.notificationRead) {
    return false;
  }

  return (
    application.status === ROLE_APPLICATION_STATUSES.APPROVED ||
    application.status === ROLE_APPLICATION_STATUSES.REJECTED
  );
}

function decisionMessage(
  application: RoleApplication,
  statusText: string
): string {
  const reason =
    application.status === ROLE_APPLICATION_STATUSES.REJECTED
      ? application.rejectReason?.trim()
      : '';

  return reason ? `${statusText}. Причина: ${reason}` : statusText;
}

function ProfileNotifications({ user }: { user: User }) {
  const markRead = useMarkRoleNotificationRead();
  const landlordApplication = user.landlordApplication ?? null;
  const masterApplication = user.masterApplication ?? null;
  const landlordUnread = isUnreadDecision(landlordApplication);
  const masterUnread = isUnreadDecision(masterApplication);

  if (!landlordUnread && !masterUnread) {
    return null;
  }

  return (
    <section className={styles.notifications}>
      <h2>Уведомления</h2>
      {landlordUnread && landlordApplication && (
        <ApplicationNotice
          message={decisionMessage(
            landlordApplication,
            getLandlordStatusText(user.landlordRoleStatus)
          )}
          updatedAt={landlordApplication.lastUpdated}
          onRead={() => markRead.mutateAsync('landlord')}
          onCommitted={markRead.commitReadUser}
        />
      )}
      {masterUnread && masterApplication && (
        <ApplicationNotice
          message={decisionMessage(
            masterApplication,
            getMasterStatusText(user.masterRoleStatus)
          )}
          updatedAt={masterApplication.lastUpdated}
          onRead={() => markRead.mutateAsync('master')}
          onCommitted={markRead.commitReadUser}
        />
      )}
    </section>
  );
}

function ApplicationNotice({
  message,
  updatedAt,
  onRead,
  onCommitted,
}: {
  message: string;
  updatedAt: string | null;
  onRead: () => Promise<User>;
  onCommitted: (user: User) => void;
}) {
  const [phase, setPhase] = useState<'idle' | 'checked' | 'leaving'>('idle');
  const readUser = useRef<User | null>(null);
  const committed = useRef(false);

  useEffect(() => {
    if (phase !== 'leaving' || !readUser.current || committed.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (committed.current || !readUser.current) {
        return;
      }

      committed.current = true;
      onCommitted(readUser.current);
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onCommitted, phase]);

  async function handleRead() {
    if (phase !== 'idle') {
      return;
    }

    setPhase('checked');

    try {
      const user = await onRead();
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (reduceMotion) {
        committed.current = true;
        onCommitted(user);
        return;
      }

      readUser.current = user;
      window.setTimeout(() => {
        setPhase('leaving');
      }, 320);
    } catch {
      setPhase('idle');
    }
  }

  function handleAnimationEnd(event: React.AnimationEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      phase !== 'leaving' ||
      committed.current ||
      !readUser.current
    ) {
      return;
    }

    committed.current = true;
    onCommitted(readUser.current);
  }

  const checked = phase !== 'idle';
  const timeLabel = formatDateTime(updatedAt);

  return (
    <div
      className={`${styles.notice} ${phase === 'leaving' ? styles.leaving : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.body}>
        <div className={styles.text}>
          <p>{message}</p>
          {timeLabel && (
            <time dateTime={updatedAt ?? undefined}>{timeLabel}</time>
          )}
        </div>
        <button
          type="button"
          className={`${styles.read} ${checked ? styles.checked : ''}`}
          aria-label="Прочитано"
          disabled={checked}
          onClick={() => {
            void handleRead();
          }}
        >
          <svg className={styles.check} viewBox="0 0 16 12" aria-hidden="true">
            <path
              d="M2 6L6 10L14 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProfileNotifications;
