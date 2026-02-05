import Button from '../../components/Button';
import IllustratedMessage from '../../components/IllustratedMessage';
import ProfileCard from '../../components/ProfileCard';
import Spinner from '../../components/Spinner';
import { useProfiles, useDeleteProfile } from '../../hooks/useProfilesMock';
import styles from './Login.module.scss';

interface LoginChooseProfileProps {
  onNext: (profileId: string) => void;
}

function LoginChooseProfile({ onNext }: LoginChooseProfileProps) {
  const { data: profiles, isLoading, error } = useProfiles();
  const deleteProfileMutation = useDeleteProfile();

  const handleProfileSelect = (profileId: string) => {
    onNext(profileId);
  };

  const handleProfileDelete = (profileId: string) => {
    // TODO: Implement profile deletion
    deleteProfileMutation.mutate(profileId);
  };

  const handleAddProfile = () => {
    // TODO: Implement profile creation
    console.log('Add new profile');
  };

  if (isLoading) {
    return (
      <div className={styles.login}>
        <Spinner />
      </div>
    );
  }

  // TODO: update error message
  if (error) {
    return (
      <div className={styles.login}>
        <IllustratedMessage
          title="Ошибка"
          description="Не удалось загрузить профили. Попробуйте позже."
        />
      </div>
    );
  }

  return (
    <div className={styles.login}>
      <IllustratedMessage
        title="Выберите профиль"
        description="Для доступа к вашим данным и настройкам"
      >
        <div className={styles.profileList}>
          {profiles?.map((profile) => (
            <ProfileCard
              key={profile.id}
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              surname={profile.surname}
              role={profile.role}
              phone={profile.phone}
              onSelect={() => handleProfileSelect(profile.id)}
              onDelete={() => handleProfileDelete(profile.id)}
            />
          ))}
        </div>
      </IllustratedMessage>

      <footer>
        <Button onClick={handleAddProfile}>Добавить профиль</Button>
      </footer>
    </div>
  );
}

export default LoginChooseProfile;
