import { Result, Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/shared/utils/http';

export default function RouteErrorBoundary() {
  const err = useRouteError();
  const navigate = useNavigate();
  const {t} = useTranslation();

  useEffect(() => {
    if (isRouteErrorResponse(err) && err.status === 404) {
      navigate('/', { replace: true });
    }
  }, [err, navigate]);

  let title = t('errorBoundary.title');
  let subTitle = '';

  if (isRouteErrorResponse(err)) {
    title = `${err.status} ${err.statusText}`;
    subTitle = getErrorMessage(err.data, '');
  }

  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={<Button onClick={() => navigate('/')}>{t('errorBoundary.goHome')}</Button>}
    />
  );
}
