export function userDetailsQueryKey(userId: number | null) {
  return ['user-details', userId] as const;
}
