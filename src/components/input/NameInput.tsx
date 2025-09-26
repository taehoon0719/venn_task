import { Input, type InputProps } from 'antd';

import { useFormattedInput } from '@/shared/hooks/useFormattedInput';
import { collapseSpacesLeftTrim } from '@/shared/utils/text';

type NameInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (v: string) => void;
};

const ALLOWED_SINGLE = /[\p{L}\p{M}'\- ]/u;
const STRIP_DISALLOWED = /[^\p{L}\p{M}'\- ]+/gu;

const NameInput = ({ value, onChange, maxLength, ...rest }: NameInputProps) => {
  const { handleChange, handlePaste, handleKeyDown } = useFormattedInput({
    value,
    maxLength,
    onChange,
    formatValue: (val) =>
      collapseSpacesLeftTrim((val || '').replace(STRIP_DISALLOWED, '')),
    allowKey: (k) => ALLOWED_SINGLE.test(k),
  });

  return (
    <Input
      {...rest}
      value={value}
      maxLength={maxLength}
      inputMode="text"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
    />
  );
};

export default NameInput;
