import { ROLE_APPLICATION_STATUSES } from '../../types/user';

export function getLandlordStatusText(status: string): string {
  if (status === ROLE_APPLICATION_STATUSES.WAITING_APPROVAL) {
    return 'Ваша заявка на создание рабочего места принята и находится в статусе На рассмотрении';
  }
  if (status === ROLE_APPLICATION_STATUSES.APPROVED) {
    return 'Ваша заявка арендодателя одобрена';
  }
  if (status === ROLE_APPLICATION_STATUSES.REJECTED) {
    return 'Ваша заявка арендодателя отклонена';
  }
  return '';
}

export function getMasterStatusText(status: string): string {
  if (status === ROLE_APPLICATION_STATUSES.WAITING_APPROVAL) {
    return 'Ваша заявка мастера находится в статусе На рассмотрении';
  }
  if (status === ROLE_APPLICATION_STATUSES.APPROVED) {
    return 'Ваша заявка мастера одобрена';
  }
  if (status === ROLE_APPLICATION_STATUSES.REJECTED) {
    return 'Ваша заявка мастера отклонена';
  }
  return '';
}
