export interface User {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  createdAt: string;
}

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  MASTER: 'MASTER',
  LANDLORD: 'LANDLORD',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const UserRoleLabels: Record<UserRole, string> = {
  [USER_ROLES.CUSTOMER]: 'Клиент',
  [USER_ROLES.MASTER]: 'Мастер',
  [USER_ROLES.LANDLORD]: 'Арендодатель',
};

export function getUserRoleLabel(role: UserRole): string {
  return UserRoleLabels[role];
}
