import { api } from '@/shared/lib/axios';
import { getErrorMessage } from '@/shared/utils/http';

import type { CorpResponse } from './types';

export const getCorpValidation = async (corpNumber: string) => {
  try {
    const { data } = await api.get<CorpResponse>(`/corporation-number/${corpNumber}`);
    return data;
  } catch (e: unknown) {
    throw new Error(getErrorMessage(e, 'Validation failed'))
  }
};