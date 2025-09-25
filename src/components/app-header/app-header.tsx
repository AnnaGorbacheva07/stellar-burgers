import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { RootState, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  // Отображение имени пользователя, если он авторизован
  const { user } = useSelector((state: RootState) => state.user);
  return <AppHeaderUI userName={user?.name || ''} />;
};
