import { RootState } from '../store';

export const selectFeed = (state: RootState) => state.feeds.feed;
export const selectOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
export const selectError = (state: RootState) => state.feeds.error;
