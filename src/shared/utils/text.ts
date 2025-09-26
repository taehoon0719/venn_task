export const clip = (s: string, max?: number) =>
  typeof max === 'number' ? s.slice(0, max) : s;

export const onlyDigits = (s: string) => s.replace(/\D+/g, '');

export const collapseSpacesLeftTrim = (s: string) =>
  s.replace(/\s+/g, ' ').replace(/^\s+/, '');

export const isControlKey = (e: React.KeyboardEvent<HTMLInputElement>) =>
  [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
  ].includes(e.key) ||
  e.ctrlKey ||
  e.metaKey;
