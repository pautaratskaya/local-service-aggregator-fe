import type { Premise, Workspace } from '../../api/admin/listLandlords';

export function findPremise(
  premises: Premise[] | undefined,
  id: string | undefined,
) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    return null;
  }

  return premises?.find((premise) => premise.id === numericId) ?? null;
}

export function findWorkspace(
  premises: Premise[] | undefined,
  id: string | undefined,
): { premise: Premise; workspace: Workspace } | null {
  const numericId = Number(id);

  if (!premises || !Number.isInteger(numericId)) {
    return null;
  }

  for (const premise of premises) {
    const workspace = premise.workspaces.find((item) => item.id === numericId);

    if (workspace) {
      return { premise, workspace };
    }
  }

  return null;
}
