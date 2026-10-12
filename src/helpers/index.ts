export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export { isElementVisible } from './dom';
export { ruCount } from './ruCount';
export {
  formatDate,
  formatDateTime,
  formatOptional,
  formatSecondsToTime,
} from './format';
