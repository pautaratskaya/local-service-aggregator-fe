import { requestCode } from './requestCode';
import { login } from './login';
import { register } from './register';
import { getUser } from './user';
import { markRoleNotificationRead } from './markRoleNotificationRead';

export const authService = {
  requestCode,
  login,
  register,
  getUser,
  markRoleNotificationRead,
};
