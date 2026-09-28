import type { LandlordApplication } from '../../types/landlord';
import { getStoredApplication } from './storage';

export async function getMyApplication(
  userId: number
): Promise<LandlordApplication | null> {
  return getStoredApplication(userId);
}
