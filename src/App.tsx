import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes';
import './i18n';
import '@/styles/global.css';

export default function App() {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
