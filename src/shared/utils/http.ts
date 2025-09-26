import axios from 'axios';

type ApiErrorBody = { message?: string };

export const getErrorMessage = (e: unknown, fallback: string) => {
  if (axios.isAxiosError(e)) return (e.response?.data as ApiErrorBody | undefined)?.message ?? fallback;
  if (e instanceof Error) return e.message;
  return fallback;
};