import { useLayoutEffect, useState } from 'react';
import type { RequestMasterPayload } from '../../api/master/requestMaster';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import PageLoader from '../../components/PageLoader';
import TextareaInput from '../../components/TextareaInput';
import TextInput from '../../components/TextInput';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ROLE_APPLICATION_STATUSES } from '../../types/user';
import { useMyMaster } from './hooks/useMyMaster';
import { useRequestMaster } from './hooks/useRequestMaster';
import styles from './BecomeMaster.module.scss';

type Errors = Partial<Record<'name' | 'speciality', string>>;

function BecomeMaster() {
  const { data: user } = useCurrentUser();
  const isReapply =
    user?.masterRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED;
  const masterQuery = useMyMaster(isReapply);
  const master = masterQuery.data;
  const masterId = master?.id;
  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const submitMutation = useRequestMaster();
  const showLoader = isReapply && !masterQuery.isError && masterQuery.isLoading;

  useLayoutEffect(() => {
    if (!master) {
      return;
    }

    setName(master.name ?? '');
    setSpeciality(master.speciality ?? '');
    setCity(master.city ?? '');
    setDescription(master.bio ?? '');
    // Refetching the same profile must not overwrite edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId]);

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!name.trim()) nextErrors.name = 'Введите имя';
    if (!speciality.trim()) nextErrors.speciality = 'Введите специальность';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): RequestMasterPayload => {
    const payload: RequestMasterPayload = {
      name: name.trim(),
      speciality: speciality.trim(),
    };
    const trimmedCity = city.trim();
    const trimmedDescription = description.trim();

    if (trimmedCity) payload.city = trimmedCity;
    if (trimmedDescription) payload.description = trimmedDescription;

    return payload;
  };

  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }

    submitMutation.mutate(buildPayload());
  };

  return (
    <Modal title={isReapply ? 'Исправить заявку' : 'Стать мастером'}>
      {showLoader ? (
        <PageLoader />
      ) : (
        <form
          className={styles.becomeMaster}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className={styles.content}>
            <p className={styles.description}>
              {isReapply
                ? 'Проверьте данные отклонённой заявки и отправьте её снова.'
                : 'Заполните обязательные поля для отправки заявки на модерацию'}
            </p>
            {isReapply && masterQuery.isError && (
              <p className={styles.error}>
                Не удалось загрузить предыдущую заявку. Заполните форму заново.
              </p>
            )}
            <TextInput
              label="Имя"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Анна Иванова"
              autoFocus
              error={errors.name}
            />
            <TextInput
              label="Специальность"
              required
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              placeholder="Например, Парикмахер"
              error={errors.speciality}
            />
            <TextInput
              label="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Например, Минск"
            />
            <TextareaInput
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Коротко о себе и опыте"
            />
            {submitMutation.error && (
              <p className={styles.error}>
                {submitMutation.error instanceof Error
                  ? submitMutation.error.message
                  : 'Не удалось отправить заявку'}
              </p>
            )}
          </div>

          <footer>
            <Button type="submit" cta disabled={submitMutation.isPending}>
              {submitMutation.isPending
                ? 'Отправляем...'
                : isReapply
                  ? 'Отправить снова'
                  : 'Отправить на модерацию'}
            </Button>
          </footer>
        </form>
      )}
    </Modal>
  );
}

export default BecomeMaster;
