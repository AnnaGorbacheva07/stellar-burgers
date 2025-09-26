import { RootState } from '../store';

export const selectOrdersState = (state: RootState) => state.orders;

export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;

export const selectOrderData = (state: RootState) => state.orders.orderData;
