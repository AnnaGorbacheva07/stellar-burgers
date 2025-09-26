import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState, useSelector } from '../../services/store';
import { selectFeed, selectOrders } from '../../services/selectors/feed';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const feed = useSelector(selectFeed);
  const orders = useSelector(selectOrders);
  /*const { orders, feed, isLoading, error } = useSelector(
    (state: RootState) => state.feeds
  );*/
  if (!feed || !orders) {
    return <div>Загрузка данных...</div>;
  }

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
