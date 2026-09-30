import Spinner from '../Spinner';
import styles from './PageLoader.module.scss';

function PageLoader() {
  return (
    <div className={styles.pageLoader} role="status" aria-label="Загрузка">
      <Spinner />
    </div>
  );
}

export default PageLoader;
