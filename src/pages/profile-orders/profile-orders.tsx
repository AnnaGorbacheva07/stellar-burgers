import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feeds.orders as TOrder[]);
  const isLoading = useSelector((state) => state.feeds.isLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
