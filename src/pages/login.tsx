import { useLocation } from 'react-router-dom';
import { Card, Flex, Typography } from 'antd';
import { ThemeToggle } from '@/features/theme';

const { Title, Text } = Typography;

export function LoginPage() {
  const location = useLocation() as { state?: { from?: Location } };
  const fromPath = location.state?.from ? (location.state.from as Location).pathname : '/';

  return (
    <Flex
      vertical
      align="stretch"
      style={{ minHeight: '100vh', padding: 24, boxSizing: 'border-box' }}
    >
      <Flex justify="flex-end" style={{ marginBottom: 24 }}>
        <ThemeToggle />
      </Flex>
      <Flex flex={1} align="center" justify="center">
        <Card style={{ maxWidth: 420, width: '100%' }}>
          <Title level={2} style={{ marginTop: 0 }}>
            Вход
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Здесь должен быть реальный экран авторизации.
          </Text>
          <Text>
            После успешного логина — переход на сохранённый маршрут:{' '}
            <code>fromPath = {fromPath}</code>
          </Text>
        </Card>
      </Flex>
    </Flex>
  );
}
export default LoginPage;
