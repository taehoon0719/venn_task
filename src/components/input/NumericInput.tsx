import { Input, type InputProps } from 'antd';

import { useFormattedInput } from '@/shared/hooks/useFormattedInput';
import { onlyDigits } from '@/shared/utils/text';

type NumericInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (v: string) => void;
};

const NumericInput = ({ value, onChange, maxLength, ...rest }: NumericInputProps) => {
  const { handleChange, handlePaste, handleKeyDown } = useFormattedInput({
    value,
    maxLength,
    onChange,
    formatValue: (val) => onlyDigits(val),
    allowKey: (k) => /^\d$/.test(k),
  });

  return (
    <Input
      {...rest}
      value={value}
      maxLength={maxLength}
      inputMode="numeric"
      pattern="\d*"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
    />
  );
};

export default NumericInput;
