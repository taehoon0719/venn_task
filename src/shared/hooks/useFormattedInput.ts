// src/shared/hooks/useFormattedInput.ts
import { useCallback } from 'react';

import { clip, isControlKey } from '@/shared/utils/text';

type UseFormattedArgs = {
  value?: string;
  maxLength?: number;
  onChange?: (v: string) => void;
  formatValue: (raw: string) => string;
  allowKey?: (key: string) => boolean;
};

export const useFormattedInput = ({
  maxLength,
  onChange,
  formatValue,
  allowKey,
}: UseFormattedArgs) => {
  const updateText = useCallback(
    (next: string) => onChange?.(clip(next, maxLength)),
    [onChange, maxLength],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateText(formatValue(e.target.value || ''));
    },
    [updateText, formatValue],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      updateText(formatValue(e.clipboardData.getData('text') || ''));
    },
    [updateText, formatValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isControlKey(e)) return;
      if (!allowKey) return;
      if (!allowKey(e.key)) e.preventDefault();
    },
    [allowKey],
  );

  return { handleChange, handlePaste, handleKeyDown, updateText };
};
