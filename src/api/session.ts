import { useAuthStore } from '../stores/authStore';

export function checkSession(response: Response) {
  if (response.status === 401) {
    useAuthStore.getState().expireSession();
  }
}
