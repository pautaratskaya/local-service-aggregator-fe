import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { HomeIcon } from '../../icons';
import type { User } from '../../types/user';
import HeaderMenu from './HeaderMenu';

interface HeaderProps {
  user: User;
}

function Header({ user }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link className={styles.homeLink} to="/">
        <HomeIcon />
        <span>Главная</span>
      </Link>
      <HeaderMenu user={user} />
    </header>
  );
}

export default Header;
