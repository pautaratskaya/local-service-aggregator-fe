import { approveLandlord } from './approveLandlord';
import { approveMaster } from './approveMaster';
import { listLandlords } from './listLandlords';
import { listMasters } from './listMasters';
import { rejectLandlord } from './rejectLandlord';
import { rejectMaster } from './rejectMaster';
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
  listMasters,
  approveMaster,
  rejectMaster,
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
