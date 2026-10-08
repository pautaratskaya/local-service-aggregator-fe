import { approveLandlord } from './approveLandlord';
import { listLandlords } from './listLandlords';
import { rejectLandlord } from './rejectLandlord';
import {
  createServiceGroup,
  deleteServiceGroup,
  getServiceGroup,
  updateServiceGroup,
} from './serviceGroup';
import {
  createWorkspaceType,
  deleteWorkspaceType,
  getWorkspaceType,
  updateWorkspaceType,
} from './workspaceType';
import {
  createServiceItem,
  deleteServiceItem,
  getServiceItem,
  updateServiceItem,
} from './serviceItem';

export const adminService = {
  listLandlords,
  approveLandlord,
  rejectLandlord,
  getServiceGroup,
  createServiceGroup,
  updateServiceGroup,
  deleteServiceGroup,
  getWorkspaceType,
  createWorkspaceType,
  updateWorkspaceType,
  deleteWorkspaceType,
  getServiceItem,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
};
