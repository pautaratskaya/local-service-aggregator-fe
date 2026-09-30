import { approveLandlord } from './approveLandlord';
import { listLandlords } from './listLandlords';
import { rejectLandlord } from './rejectLandlord';

export const adminService = {
  listLandlords,
  approveLandlord,
  rejectLandlord,
};
