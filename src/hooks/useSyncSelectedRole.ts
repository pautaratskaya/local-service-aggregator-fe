import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { USER_ROLES, type User, type UserRole } from '../types/user';

function roleToSelect(roles: readonly UserRole[]): UserRole {
  if (roles.includes(USER_ROLES.CUSTOMER)) {
    return USER_ROLES.CUSTOMER;
  }

  return roles.find((role) => role !== USER_ROLES.ADMIN) ?? USER_ROLES.CUSTOMER;
}

export function useSyncSelectedRole(user: User | undefined) {
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);

  useEffect(() => {
    if (!user || selectedRole == null || user.roles.includes(selectedRole)) {
      return;
    }

    setSelectedRole(roleToSelect(user.roles));
  }, [user, selectedRole, setSelectedRole]);
}
