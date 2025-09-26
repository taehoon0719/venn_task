import { Input, type InputProps } from 'antd';

import { useFormattedInput } from '@/shared/hooks/useFormattedInput';
import { onlyDigits } from '@/shared/utils/text';

type PhoneInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (v: string) => void;
};

const COUNTRY = '+1';
const formatSpaces = (d10: string) => {
  const a = d10.slice(0, 3),
    b = d10.slice(3, 6),
    c = d10.slice(6, 10);
  if (d10.length <= 3) return `${COUNTRY} ${a}`;
  if (d10.length <= 6) return `${COUNTRY} ${a} ${b}`;
  return `${COUNTRY} ${a} ${b} ${c}`;
};

const toLocal10 = (raw: string) => {
  const digits = onlyDigits(raw);
  let local = digits;

  if (raw.trim().startsWith(COUNTRY)) {
    local = digits.startsWith('1') ? digits.slice(1) : digits;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    local = digits.slice(1);
  }

  return local.slice(0, 10);
};

const PhoneInput = ({ value, onChange, ...rest }: PhoneInputProps) => {
  const formatValue = (val: string) => {
    const local10 = toLocal10(val);
    return local10 ? formatSpaces(local10) : `${COUNTRY} `;
  };

  const { handleChange, handlePaste, handleKeyDown } = useFormattedInput({
    value,
    onChange,
    formatValue,
    allowKey: (k) => /^\d$/.test(k),
  });

  const displayed = formatValue(value || '');

  return (
    <Input
      {...rest}
      value={displayed}
      type="tel"
      inputMode="numeric"
      pattern="^\+?[\d ]*$"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
    />
  );
};

export default PhoneInput;
