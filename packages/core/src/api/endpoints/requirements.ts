import type { AppRequirements, RequirementForm, RequirementFormAnswers, RequirementFormSubmitted } from '../../types';
import { PollarApiError } from '../../types';
import type { PollarApiClient } from '../client';

function requirementApiError(error: unknown, fallback: string): PollarApiError {
  const body = (typeof error === 'object' && error !== null ? error : {}) as Record<string, unknown>;
  const code = typeof body.code === 'string' ? body.code : typeof body.error === 'string' ? body.error : fallback;
  return new PollarApiError(code, body);
}

/**
 * GET /requirements/forms/{formId}
 * The form a FORM requirement step asks for (the `optionId` of a pending step in
 * the quote's `requirementsRequired`): its fields, the user's previous answers to
 * prefill, and `missing`, the required keys still open.
 */
export async function getRequirementForm(api: PollarApiClient, formId: string): Promise<RequirementForm> {
  const { data, error } = await api.GET('/requirements/forms/{formId}', { params: { path: { formId } } });
  if (!data?.content || error) throw requirementApiError(error, 'Failed to load the form');
  return data.content;
}

/**
 * POST /requirements/forms/{formId}
 * Submit the full set of answers. Invalid answers throw a {@link PollarApiError}
 * with code `KYC_FORM_INVALID_ANSWERS` and `body.errors` listing `{ key, code }`
 * per field. Quote again afterwards.
 */
export async function submitRequirementForm(
  api: PollarApiClient,
  formId: string,
  answers: RequirementFormAnswers,
): Promise<RequirementFormSubmitted> {
  const { data, error } = await api.POST('/requirements/forms/{formId}', {
    params: { path: { formId } },
    body: { answers },
  });
  if (!data?.content || error) throw requirementApiError(error, 'Failed to submit the form');
  return data.content;
}

/**
 * GET /requirements
 * The app's own KYC steps (every one required, in order, each with equivalent
 * options) and where the user stands: each step's completion and `next`, the first
 * pending step, or null when every step is complete. Nothing is blocked on it.
 */
export async function getAppRequirements(api: PollarApiClient): Promise<AppRequirements> {
  const { data, error } = await api.GET('/requirements');
  if (!data?.content || error) throw requirementApiError(error, 'Failed to load the verification steps');
  return data.content;
}
