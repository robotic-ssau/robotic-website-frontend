import { useLocation } from 'react-router-dom';

export function LoginPage() {
  const location = useLocation() as { state?: { from?: Location } };
  const fromPath = location.state?.from ? (location.state.from as Location).pathname : '/';

  return (
    <div>
      <h1>Логин</h1>
      <p>Здесь должен быть реальный экран авторизации.</p>
      <p>
        После успешного логина необходимо сделать навигацию на сохранённый маршрут:{' '}
        <code>fromPath = {fromPath}</code>.
      </p>
      <p>
        {/*
          Пример ручной интеграции:
          const navigate = useNavigate();
          const handleSuccess = () => {
            navigate(fromPath, { replace: true });
          };
        */}
      </p>
    </div>
  );
}
export default LoginPage;
