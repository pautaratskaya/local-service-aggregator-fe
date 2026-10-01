import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './Admin.module.scss';

function Admin() {
  const navigate = useNavigate();

  return (
    <div className={styles.admin}>
      <h1>Админка</h1>
      <Button onClick={() => navigate('/admin/applications')} cta>
        {/* TODO: add count */}
        Просмотреть заявки
      </Button>
    </div>
  );
}

export default Admin;
