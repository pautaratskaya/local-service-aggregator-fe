import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { masterService } from '../../api/master/masterService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import TextInput from '../../components/TextInput';
import { useToast } from '../../components/Toast/toastContext';
import { queryClient } from '../../providers/QueryProvider';
import { useAuthStore } from '../../stores/authStore';
import styles from './BecomeMaster.module.scss';

type Errors = Partial<Record<'name' | 'speciality', string>>;

function BecomeMaster() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return masterService.requestMaster({
        token,
        payload: {
          name: name.trim(),
          speciality: speciality.trim(),
        },
      });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отправлена');
      await queryClient.invalidateQueries({
        queryKey: ['user-details', userId],
      });

      const background = location.state?.background;
      navigate(background?.pathname || '/');
    },
  });

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!name.trim()) nextErrors.name = 'Введите имя';
    if (!speciality.trim()) nextErrors.speciality = 'Введите специальность';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }
    submitMutation.mutate();
  };

  return (
    <Modal title="Стать мастером">
      <div className={styles.becomeMaster}>
        <div className={styles.content}>
          <p className={styles.description}>
            Заполните обязательные поля для отправки заявки на модерацию
          </p>
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
          {submitMutation.error && (
            <p className={styles.error}>
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Не удалось отправить заявку'}
            </p>
          )}
        </div>

        <footer>
          <Button onClick={onSubmit} cta disabled={submitMutation.isPending}>
            {submitMutation.isPending
              ? 'Отправляем...'
              : 'Отправить на модерацию'}
          </Button>
        </footer>
      </div>
    </Modal>
  );
}

export default BecomeMaster;
