import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state: RootState) => state.feeds.feed);
  const orders = useSelector((state: RootState) => state.feeds.orders);
  const isLoading = useSelector((state: RootState) => state.feeds.isLoading);
  const error = useSelector((state: RootState) => state.feeds.error);

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
