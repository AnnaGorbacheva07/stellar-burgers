import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        loginUser({
          email,
          password
        })
      );
      navigate('/profile', { replace: true });
    } catch (err: unknown) {
      // Явно указываем тип unknown
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message || 'Ошибка авторизации');
      } else {
        setError('Произошла непредвиденная ошибка');
      }
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
