import { useAuthStore } from '../../stores/authStore';
import LandlordApplications from './LandlordApplications';
import MasterApplications from './MasterApplications';
import styles from './Admin.module.scss';

function AdminApplications() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <p className={styles.empty}>Требуется авторизация</p>;
  }

  return (
    <div className={styles.admin}>
      <LandlordApplications />
      <MasterApplications />
    </div>
  );
}

export default AdminApplications;
