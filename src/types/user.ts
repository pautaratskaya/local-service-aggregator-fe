export const ROLE_APPLICATION_STATUSES = {
  NO: 'NO',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type RoleApplicationStatus =
  (typeof ROLE_APPLICATION_STATUSES)[keyof typeof ROLE_APPLICATION_STATUSES];

export interface RoleApplication {
  status: RoleApplicationStatus;
  lastUpdated: string | null;
  rejectReason: string | null;
  notificationRead: boolean;
}

export interface User {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  createdAt: string;
  landlordRoleStatus: RoleApplicationStatus;
  masterRoleStatus: RoleApplicationStatus;
  landlordApplication: RoleApplication | null;
  masterApplication: RoleApplication | null;
}

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  MASTER: 'MASTER',
  LANDLORD: 'LANDLORD',
  ADMIN: 'ADMINISTRATOR',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const UserRoleLabels: Record<UserRole, string> = {
  [USER_ROLES.CUSTOMER]: 'Клиент',
  [USER_ROLES.MASTER]: 'Мастер',
  [USER_ROLES.LANDLORD]: 'Арендодатель',
  [USER_ROLES.ADMIN]: 'Админ',
};

export function getUserRoleLabel(role: UserRole): string {
  return UserRoleLabels[role];
}
