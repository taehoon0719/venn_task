import { api } from '@/shared/lib/axios';
import { getErrorMessage } from '@/shared/utils/http';

import type { ProfilePayload } from './types';

export const submitProfile = async (body: ProfilePayload) => {
  try {
    const { data } = await api.post<string>('/profile-details', body);
    return data;
  } catch (e: unknown) {
    throw new Error(getErrorMessage(e, 'Submission failed'));
  }
};
