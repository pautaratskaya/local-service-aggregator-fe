import PageLoader from '../../components/PageLoader';
import Modal from '../../components/Modal';
import PremiseForm from '../../components/PremiseForm';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLandlordPremises } from '../../hooks/useLandlordPremises';
import { ROLE_APPLICATION_STATUSES } from '../../types/user';
import { useSubmitLandlordApplication } from './hooks/useSubmitLandlordApplication';
import { pickRejectedPremise } from './rejectedPremise';

function BecomeLandlord() {
  const { data: user } = useCurrentUser();
  const isReapply =
    user?.landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED;
  const premisesQuery = useLandlordPremises(isReapply);
  const rejectedPremise = pickRejectedPremise(premisesQuery.data);
  const submitMutation = useSubmitLandlordApplication();
  const showLoader =
    isReapply && !premisesQuery.isError && premisesQuery.isLoading;

  return (
    <Modal title={isReapply ? 'Исправить заявку' : 'Стать арендодателем'}>
      {showLoader ? (
        <PageLoader />
      ) : (
        <PremiseForm
          description={
            isReapply
              ? 'Проверьте данные отклонённой заявки и отправьте её снова.'
              : 'Заполните обязательные поля для отправки заявки на модерацию'
          }
          notice={
            isReapply && premisesQuery.isError
              ? 'Не удалось загрузить предыдущую заявку. Заполните форму заново.'
              : undefined
          }
          submitLabel={isReapply ? 'Отправить снова' : 'Отправить на модерацию'}
          isPending={submitMutation.isPending}
          submitError={submitMutation.error}
          initialPremise={rejectedPremise}
          onSubmit={(payload) => submitMutation.mutate(payload)}
        />
      )}
    </Modal>
  );
}

export default BecomeLandlord;
