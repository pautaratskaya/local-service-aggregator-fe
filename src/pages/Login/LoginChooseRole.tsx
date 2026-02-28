import Button from '../../components/Button';
import IllustratedMessage from '../../components/IllustratedMessage';
import RoleCard from '../../components/RoleCard';
import type { User, UserRole } from '../../types/user';
import styles from './Login.module.scss';

interface LoginChooseRoleProps {
  onNext: (role: UserRole) => void;
  user: User;
}

function LoginChooseRole({ onNext, user }: LoginChooseRoleProps) {
  const handleRoleSelect = (role: UserRole) => {
    onNext(role);
  };

  const handleRoleDelete = (role: UserRole) => {
    console.log('===> handleRoleDelete', role);
    // TODO: Implement role deletion
  };

  const handleAddRole = () => {
    // TODO: Implement role creation
    console.log('Add new role');
  };

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Выберите профиль"
        description="Для доступа к вашим данным и настройкам"
      >
        <div className={styles.roleList}>
          {user?.roles.map((role) => (
            <RoleCard
              key={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              role={role}
              phone={user.phone}
              onSelect={() => handleRoleSelect(role)}
              onDelete={() => handleRoleDelete(role)}
            />
          ))}
        </div>
      </IllustratedMessage>

      <footer>
        <Button onClick={handleAddRole}>Добавить профиль</Button>
      </footer>
    </div>
  );
}

export default LoginChooseRole;
