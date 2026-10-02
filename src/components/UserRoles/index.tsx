import { flushSync } from 'react-dom';
import styles from './UserRoles.module.scss';
import { useAuthStore } from '../../stores/authStore';
import { getUserRoleLabel, USER_ROLES, type UserRole } from '../../types/user';

interface UserRolesProps {
  roles: UserRole[];
}

function UserRoles({ roles }: UserRolesProps) {
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);
  const isAdmin = roles.includes(USER_ROLES.ADMIN);
  const currentRole =
    selectedRole && selectedRole !== USER_ROLES.ADMIN && roles.includes(selectedRole)
      ? selectedRole
      : null;
  const otherRoles = roles.filter(
    (role) => role !== USER_ROLES.ADMIN && role !== currentRole,
  );
  const canApplyForMoreRoles =
    !roles.includes(USER_ROLES.MASTER) || !roles.includes(USER_ROLES.LANDLORD);

  function selectRole(role: UserRole) {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion || !document.startViewTransition) {
      setSelectedRole(role);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setSelectedRole(role);
      });
    });
  }

  return (
    <div className={styles.rolesSection} aria-label="Роли пользователя">
      <div className={styles.rolesLine}>
        <span className={styles.rolesHeading}>Текущая роль:</span>
        {isAdmin && (
          <span className={styles.adminRole}>{getUserRoleLabel(USER_ROLES.ADMIN)}</span>
        )}
        {currentRole && (
          <span
            className={styles.currentRole}
            style={{ viewTransitionName: `role-${currentRole}` }}
          >
            {getUserRoleLabel(currentRole)}
          </span>
        )}
      </div>
      {otherRoles.length > 0 && (
        <div className={styles.rolesLine}>
          <span className={styles.rolesHeading}>Выбрать другую роль:</span>
          {otherRoles.map((role) => (
            <button
              key={role}
              type="button"
              className={styles.roleButton}
              style={{ viewTransitionName: `role-${role}` }}
              onClick={() => selectRole(role)}
            >
              {getUserRoleLabel(role)}
            </button>
          ))}
        </div>
      )}
      {canApplyForMoreRoles && (
        <p className={styles.hint}>
          Подать заявку на другие роли можно через профиль в меню.
        </p>
      )}
    </div>
  );
}

export default UserRoles;
