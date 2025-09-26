import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
