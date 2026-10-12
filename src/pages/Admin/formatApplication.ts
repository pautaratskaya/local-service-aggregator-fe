const PREMISE_STATUS_LABELS: Record<string, string> = {
  UNDER_REVIEW: 'На проверке',
  APPROVED: 'Одобрено',
  REJECTED: 'Отклонено',
};

export function formatPremiseStatus(status: string) {
  return PREMISE_STATUS_LABELS[status] ?? status;
}
