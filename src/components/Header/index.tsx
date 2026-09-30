import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { HomeIcon } from '../../icons';
import { getUserRoleLabel, USER_ROLES, type User } from '../../types/user';

interface HeaderProps {
  user: User;
}

function Header({ user }: HeaderProps) {
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
            {user.roles.map((role) => (
              <li key={role}>{getUserRoleLabel(role)}</li>
            ))}
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
