import { Col } from 'antd';

import type { ProfilePayload } from '@/apis/profile/types';
import ReusableForm, { type FieldType } from '@/components/form/ReusableForm';
import NameInput from '@/components/input/NameInput';
import NumericInput from '@/components/input/NumericInput';
import PhoneInput from '@/components/input/PhoneInput';
import CoreLayout from '@/components/layout/CoreLayout';

import useOnBoarding from './hook/useOnBoarding';

const OnboardingPage = () => {
  const { t, form, rules, submitting, onFinish } = useOnBoarding();

  const fields: FieldType<ProfilePayload>[] = [
    {
      label: t('firstName'),
      name: 'firstName',
      component: (
        <NameInput
          placeholder={t('placeholder.firstName')}
          maxLength={50}
          allowClear
        />
      ),
      rules: rules.firstName,
      col: { xs: 24, sm: 12 },
    },
    {
      label: t('lastName'),
      name: 'lastName',
      component: (
        <NameInput
          placeholder={t('placeholder.lastName')}
          maxLength={50}
          allowClear
        />
      ),
      rules: rules.lastName,
      col: { xs: 24, sm: 12 },
    },
    {
      label: t('phone'),
      name: 'phone',
      component: <PhoneInput placeholder={t('placeholder.phone')} allowClear />,
      rules: rules.phone,
    },
    {
      label: t('corpNumber'),
      name: 'corporationNumber',
      component: (
        <NumericInput placeholder={t('placeholder.corp')} maxLength={9} />
      ),
      rules: rules.corporationNumber,
    },
  ];
  return (
    <CoreLayout>
      <Col xs={24} sm={14}>
        <ReusableForm<ProfilePayload>
          title={t('title')}
          form={form}
          fields={fields}
          onFinish={onFinish}
          submitting={submitting}
        />
      </Col>
    </CoreLayout>
  );
};

export default OnboardingPage;
