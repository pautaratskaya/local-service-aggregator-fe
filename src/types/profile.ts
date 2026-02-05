export const PROFILE_ROLES = {
  CLIENT: 'client',
  MASTER: 'master',
  LANDLORD: 'landlord',
} as const;

export type ProfileRole = (typeof PROFILE_ROLES)[keyof typeof PROFILE_ROLES];

export const ProfileRoleLabels: Record<ProfileRole, string> = {
  client: 'Клиент',
  master: 'Мастер',
  landlord: 'Арендодатель',
};

export interface Profile {
  id: string;
  avatarUrl: string;
  name: string;
  surname: string;
  role: ProfileRole;
  phone: string;
}

export function getProfileRoleLabel(role: ProfileRole): string {
  return ProfileRoleLabels[role];
}
