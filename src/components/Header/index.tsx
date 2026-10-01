import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { HomeIcon } from '../../icons';
import { useAuthStore } from '../../stores/authStore';
import { getUserRoleLabel, USER_ROLES, type User } from '../../types/user';

interface HeaderProps {
  user: User;
}

function Header({ user }: HeaderProps) {
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);
  const isAdmin = user.roles.includes(USER_ROLES.ADMIN);

  return (
    <header className={styles.header}>
      <div className={styles.start}>
        <Link className={styles.homeLink} to="/">
          <HomeIcon />
          <span>Главная</span>
        </Link>
        <div className={styles.rolesSection} aria-label="Роли пользователя">
          <span className={styles.rolesHeading}>Роли</span>
          <ul className={styles.rolesList}>
            {user.roles.map((role) => {
              const isAdminRole = role === USER_ROLES.ADMIN;

              return (
                <li key={role}>
                  {isAdminRole ? (
                    <span className={styles.adminRole}>
                      {getUserRoleLabel(role)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={
                        role === selectedRole ? styles.selected : undefined
                      }
                      aria-pressed={role === selectedRole}
                      onClick={() => setSelectedRole(role)}
                    >
                      {getUserRoleLabel(role)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {isAdmin && (
        <Link className={styles.adminLink} to="/admin">
          Админка
        </Link>
      )}
    </header>
  );
}

export default Header;
