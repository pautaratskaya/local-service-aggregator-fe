export function landlordWorkspacesQueryKey(userId: number | null) {
  return ['landlord-workspaces', userId] as const;
}
