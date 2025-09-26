import { Form, notification } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getCorpValidation } from '@/apis/corporationNumber';
import { submitProfile } from '@/apis/profile';
import type { ProfilePayload } from '@/apis/profile/types';
import { getErrorMessage } from '@/shared/utils/http';

const useOnBoarding = () => {
  const [form] = Form.useForm<ProfilePayload>();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const inflightRef = useRef<{
    value: string | null;
    promise: Promise<void> | null;
  }>({
    value: null,
    promise: null,
  });

  const lastRef = useRef<{
    value: string | null;
    valid: boolean;
    message?: string;
  }>({
    value: null,
    valid: false,
  });

  const validateCorp = useMemo(
    () => async (_: unknown, value?: string) => {
      if (!value || !/^\d{9}$/.test(value)) return;

      // If same value as last completed, reuse that result - to dedupe
      if (lastRef.current.value === value) {
        if (lastRef.current.valid) return;
        throw new Error(
          lastRef.current.message || 'Invalid corporation number',
        );
      }

      // If same value is currently validating, reuse the same promise -  to dedupe
      if (inflightRef.current.value === value && inflightRef.current.promise) {
        return inflightRef.current.promise;
      }

      const p = getCorpValidation(value)
        .then((res) => {
          lastRef.current = {
            value,
            valid: !!res.valid,
          };
          if (res.valid) return;
          throw new Error(res.message || 'Invalid corporation number');
        })
        .catch((err: unknown) => {
          const msg = getErrorMessage(err, 'Validation failed');
          lastRef.current = { value, valid: false, message: msg };
          throw new Error(msg);
        })
        .finally(() => {
          if (inflightRef.current.value === value) {
            inflightRef.current.value = null;
            inflightRef.current.promise = null;
          }
        });

      inflightRef.current.value = value;
      inflightRef.current.promise = p;

      return p;
    },
    [],
  );
  const NAME_REGEX = /^[\p{L}\p{M}'\- ]+$/u;

  const nameRules = [
    { max: 50, message: t('messages.max50') },
    { pattern: NAME_REGEX, message: t('messages.onlyLetters') },
  ];

  const rules = {
    firstName: nameRules,
    lastName: nameRules,
    phone: [
      {
        pattern: /^\+1 \d{3} \d{3} \d{4}$/,
        message: t('messages.invalidPhone'),
      },
    ],
    corporationNumber: [
      { pattern: /^\d{9}$/, message: t('messages.corpDigits') },
      { validator: validateCorp },
    ],
  };

  const onFinish = async (values: ProfilePayload) => {
    setSubmitting(true);
    try {
      await submitProfile({
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.replace(/\s+/g, ''), //To remove all the spaces
      });
      notification.success({
        message: t('messages.success'),
        description: t('messages.submitted'),
      });
    } catch (e: unknown) {
      notification.error({
        message: t('messages.error'),
        description: getErrorMessage(e, t('messages.submissionFailed')),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { t, form, rules, submitting, onFinish };
};

export default useOnBoarding;
