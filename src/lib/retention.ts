/**
 * Computes exact retention cutoff dates based on compliance policies:
 * - Spam enquiries: 30 days
 * - Audit logs: 12 months (365 days)
 * - Inactive enquiries: 24 months (730 days)
 */
export function calculateRetentionCutoffs(referenceDate = new Date()) {
  const now = referenceDate.getTime();
  return {
    spamCutoff: new Date(now - 30 * 24 * 60 * 60 * 1000),
    auditCutoff: new Date(now - 365 * 24 * 60 * 60 * 1000),
    enquiryCutoff: new Date(now - 730 * 24 * 60 * 60 * 1000),
  };
}
