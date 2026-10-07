import type { RampQuoteKycRequirement } from '@pollar/core';
import { kycReviewMessage } from '../kyc-modal/kyc-messages';

/** Open platform KYC only for the backend's explicit, scoped pre-transaction gate. */
export function requiredRampKyc(error: unknown) {
  if (!error || typeof error !== 'object') return null;
  const { code, body } = error as { code?: unknown; body?: unknown };
  if (code !== 'SDK_RAMPS_KYC_REQUIRED' || !body || typeof body !== 'object') return null;
  const { rampProviderId, kycProviderId, corridorId } = body as {
    rampProviderId?: unknown;
    kycProviderId?: unknown;
    corridorId?: unknown;
  };
  if (
    typeof rampProviderId !== 'string' ||
    !rampProviderId.trim() ||
    typeof kycProviderId !== 'string' ||
    !kycProviderId.trim() ||
    typeof corridorId !== 'string' ||
    !corridorId.trim()
  )
    return null;
  return { rampProviderId, kycProviderId, corridorId };
}

/**
 * What a route held back by KYC says, and the button it offers. A verification
 * held for review (`reviewReason`) or rejected has nothing the user can do from
 * here, so those rows carry no button.
 */
export function lockedRouteCopy(requirement: Pick<RampQuoteKycRequirement, 'status' | 'reviewReason'>): {
  message: string;
  action: string | null;
} {
  switch (requirement.status) {
    case 'expired':
      return { message: 'Your verification expired', action: 'Verify again' };
    case 'pending':
      if (!requirement.reviewReason) return { message: 'Verification in progress', action: 'Continue' };
      return {
        message:
          requirement.reviewReason === 'DUPLICATE_DOCUMENT'
            ? kycReviewMessage(requirement.reviewReason)
            : 'Your verification is under review',
        action: null,
      };
    case 'rejected':
      return { message: 'Verification was not approved', action: null };
    default:
      return { message: 'Verify your identity to see this route', action: 'Verify' };
  }
}
