import { ROLE_APPLICATION_STATUSES } from '../../../types/user';

export const pendingLandlordsQueryKey = [
  'admin-landlords',
  ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
] as const;
