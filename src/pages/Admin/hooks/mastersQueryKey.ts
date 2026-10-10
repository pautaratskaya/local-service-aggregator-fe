import { ROLE_APPLICATION_STATUSES } from '../../../types/user';

export const pendingMastersQueryKey = [
  'admin-masters',
  ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
] as const;
