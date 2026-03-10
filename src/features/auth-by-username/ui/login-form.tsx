import { Button, Form, Input, type FormProps } from 'antd';
import { useLoginMutation } from '../facade/use-login-mutation';
import styles from './LoginForm.module.css';

type FieldType = {
  username: string;
  password: string;
};

export function LoginForm() {
  const { mutate, isPending, error } = useLoginMutation();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    mutate({ username: values.username, password: values.password });
  };

  const errorMessage =
    error && typeof error === 'object' && 'response' in error
      ? ((error.response as { data?: { message?: string } })?.data?.message ??
        (error as Error).message)
      : (error as Error)?.message;

  return (
    <Form<FieldType>
      name="login"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      size="large"
    >
      <Form.Item<FieldType>
        label="Имя пользователя"
        name="username"
        rules={[{ required: true, message: 'Введите имя пользователя' }]}
      >
        <Input placeholder="username" autoComplete="username" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password placeholder="••••••••" autoComplete="current-password" />
      </Form.Item>

      {errorMessage && (
        <Form.Item>
          <span className={styles.errorMessage}>{errorMessage}</span>
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
