import {
  Button,
  Col,
  Form,
  Row,
  Typography,
  type ColProps,
  type FormInstance,
  type FormItemProps,
} from 'antd';
import { useTranslation } from 'react-i18next';

import styles from './ReusableForm.module.css';

import type { NamePath } from 'antd/es/form/interface';
import type { ReactNode } from 'react';

type FieldName<T> = Extract<keyof T, string>;

export type FieldType<T extends object> = {
  label: string;
  name: FieldName<T>;
  component: ReactNode;
  rules?: FormItemProps['rules'];
  col?: ColProps;
};

export type FieldValues = Record<string, unknown>;

type ReusableFormProps<T extends object> = {
  title: string;
  form: FormInstance<T>;
  fields: FieldType<T>[];
  submitting: boolean;
  onFinish: (values: T) => void | Promise<void>;
};

const ReusableForm = <T extends object>({
  title,
  form,
  fields,
  submitting,
  onFinish,
}: ReusableFormProps<T>) => {
  const { t } = useTranslation();

  return (
    <Form<T>
      form={form}
      layout="vertical"
      validateTrigger="onBlur"
      requiredMark={false}
      onFinish={onFinish}
    >
      <Typography.Title level={4} className={styles.title}>
        {title}
      </Typography.Title>
      <Row gutter={[16, 0]}>
        {fields.map((field) => (
          <Col key={field.name} {...(field.col ?? { xs: 24 })}>
            <Form.Item
              key={field.name}
              label={field.label}
              name={field.name as NamePath}
              rules={[
                {
                  required: true,
                  message: `${field.label} is required`,
                },
                ...(field.rules ?? []),
              ]}
            >
              {field.component}
            </Form.Item>
          </Col>
        ))}
      </Row>
      <Col span={24}>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting} disabled={submitting}>
            {t('actions.submit')}
          </Button>
        </Form.Item>
      </Col>
    </Form>
  );
};

export default ReusableForm;
