import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { RootState, useSelector } from '../../services/store';
import { selectUserState } from '../../services/selectors/user';

export const AppHeader: FC = () => {
  // Отображение имени пользователя, если он авторизован
  const { user } = useSelector(selectUserState);
  return <AppHeaderUI userName={user?.name || ''} />;
};
