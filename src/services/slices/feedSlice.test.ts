import reducer, { fetchFeed, fetchProfileOrders } from './feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState = reducer(undefined, { type: '@@INIT' });

describe('feedSlice', () => {
  it('isLoading становится true при fetchFeed.pending', () => {
    const state = reducer(initialState, fetchFeed.pending('', undefined));
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('записывает данные и isLoading=false при fetchFeed.fulfilled', () => {
    const fakeFeed: TFeedsResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          name: 'order',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        }
      ],
      total: 100,
      totalToday: 10
    };
    const state = reducer(
      initialState,
      fetchFeed.fulfilled(fakeFeed, '', undefined)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      feed: fakeFeed,
      orders: fakeFeed.orders,
      error: null
    });
  });

  it('записывает ошибку и isLoading=false при fetchFeed.rejected', () => {
    const state = reducer(
      initialState,
      fetchFeed.rejected(new Error('Ошибка'), '', undefined)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка'
    });
  });

  it('isLoading становится true при fetchProfileOrders.pending', () => {
    const state = reducer(
      initialState,
      fetchProfileOrders.pending('', undefined)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('orders обновляются при fetchProfileOrders.fulfilled', () => {
    const fakeOrders: TOrder[] = [{ _id: '1', name: 'order' } as TOrder];
    const state = reducer(
      initialState,
      fetchProfileOrders.fulfilled(fakeOrders, '', undefined)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      orders: fakeOrders
    });
  });

  it('записывает ошибку при fetchProfileOrders.rejected', () => {
    const state = reducer(
      initialState,
      fetchProfileOrders.rejected(new Error('Ошибка'), '', undefined)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка'
    });
  });
});
