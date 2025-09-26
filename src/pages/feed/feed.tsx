import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

import {
  selectError,
  selectFeed,
  selectFeedsLoading,
  selectOrders
} from '../../services/selectors/feed';
export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectFeedsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  /*const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };*/

  if (isLoading || !feed) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
