export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export { isElementVisible } from './dom';
export {
  formatDate,
  formatDateTime,
  formatOptional,
  formatSecondsToTime,
} from './format';
