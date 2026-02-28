import styles from './RoleCard.module.scss';
import { getUserRoleLabel, type UserRole } from '../../types/user';
import { CrossIcon, NoAvatarIcon } from '../../icons';

interface RoleCardProps {
  avatarUrl?: string; // TODO: implement user avatars later
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  onSelect: () => void;
  onDelete: () => void;
}

function RoleCard({
  avatarUrl,
  firstName,
  lastName,
  role,
  phone,
  onSelect,
  onDelete,
}: RoleCardProps) {
  const fullName = `${firstName} ${lastName}`;
  const roleLabel = getUserRoleLabel(role);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={styles.roleCard}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Выбрать профиль ${roleLabel}, ${fullName}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className={styles.avatar} />
      ) : (
        <div className={styles.avatar}>
          <NoAvatarIcon />
        </div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{fullName}</h3>
        <p className={styles.details}>
          <span className={styles.role}>{roleLabel}</span>
          <span className={styles.dot} />
          <span className={styles.phone}>{phone}</span>
        </p>
      </div>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        aria-label="Удалить профиль"
      >
        <CrossIcon />
      </button>
    </div>
  );
}

export default RoleCard;
