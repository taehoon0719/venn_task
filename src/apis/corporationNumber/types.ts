export type CorpResponse =
  | { valid: true; corporationNumber: string }
  | { valid: false; message?: string };
