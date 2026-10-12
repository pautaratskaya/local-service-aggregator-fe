export function landlordPremisesQueryKey(userId: number | null) {
  return ['landlord-premises', userId] as const;
}
