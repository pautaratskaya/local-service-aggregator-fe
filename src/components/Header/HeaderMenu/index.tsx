import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HeaderMenu.module.scss';
import { BurgerIcon, CrossIcon } from '../../../icons';
import { useAuthStore } from '../../../stores/authStore';
import { USER_ROLES, type User } from '../../../types/user';

interface HeaderMenuProps {
  user: User;
}

function HeaderMenu({ user }: HeaderMenuProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = user.roles.includes(USER_ROLES.ADMIN);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Меню"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(true)}
      >
        <BurgerIcon />
      </button>
      {isMenuOpen && (
        <div className={styles.overlay}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Закрыть меню"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className={styles.drawer} role="dialog" aria-label="Меню">
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Закрыть меню"
              onClick={() => setIsMenuOpen(false)}
            >
              <CrossIcon />
            </button>
            <ul className={styles.menuList}>
              <li>
                <Link
                  className={styles.menuItem}
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    className={styles.menuItem}
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Админка
                  </Link>
                </li>
              )}
              <li>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderMenu;
