import {
  ROLE_APPLICATION_STATUSES,
  type RoleApplication,
  type User,
} from '../../types/user';

export function hasUnreadNotification(user: User): boolean {
  return (
    isUnreadDecision(user.landlordApplication ?? null) ||
    isUnreadDecision(user.masterApplication ?? null)
  );
}

export function isUnreadDecision(application: RoleApplication | null): boolean {
  if (!application || application.notificationRead) {
    return false;
  }

  return (
    application.status === ROLE_APPLICATION_STATUSES.APPROVED ||
    application.status === ROLE_APPLICATION_STATUSES.REJECTED
  );
}
