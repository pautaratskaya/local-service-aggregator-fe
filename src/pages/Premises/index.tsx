import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import PremiseCard from './PremiseCard';
import styles from './Premises.module.scss';

const PREMISE_LIMIT = 3;

function Premises() {
  const navigate = useNavigate();
  const location = useLocation();
  const premisesQuery = useLandlordPremises(true);
  const premises = premisesQuery.data ?? [];
  const canAddPremise = premises.length < PREMISE_LIMIT;

  if (
    premisesQuery.isLoading ||
    (premisesQuery.isError && premisesQuery.isFetching)
  ) {
    return <PageLoader />;
  }

  if (premisesQuery.isError) {
    return (
      <FetchErrorNotice
        message={
          premisesQuery.error instanceof Error
            ? premisesQuery.error.message
            : 'Не удалось загрузить помещения'
        }
        actionLabel="Повторить"
        onAction={() => {
          void premisesQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className={`${styles.premises} ${styles.listPage}`}>
      <div className={styles.header}>
        <h1>Мои помещения</h1>
        {canAddPremise && (
          <Button
            type="button"
            className={styles.addButton}
            cta
            onClick={() =>
              navigate('/add-premise', { state: { background: location } })
            }
          >
            Добавить помещение
          </Button>
        )}
      </div>
      {premises.length > 0 ? (
        <ul className={styles.list}>
          {premises.map((premise) => (
            <PremiseCard key={premise.id} premise={premise} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Помещений пока нет</p>
      )}
    </div>
  );
}

export default Premises;
