import reducer, {
  createOrder,
  fetchOrderByNumber,
  clearOrder,
  initialState
} from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  it('должен устанавливать флаг запроса при createOrder.pending', () => {
    const state = reducer(initialState, createOrder.pending('', []));
    expect(state).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    });
  });

  it('orderData обновляется при createOrder.fulfilled', () => {
    const fakeOrder: TOrder = { _id: '1', name: 'order' } as TOrder;
    const state = reducer(
      initialState,
      createOrder.fulfilled(fakeOrder, '', ['id1', 'id2'])
    );
    expect(state).toEqual({
      ...initialState,
      orderData: fakeOrder,
      orderRequest: false
    });
  });

  it('записывает ошибку при createOrder.rejected', () => {
    const state = reducer(
      initialState,
      createOrder.rejected(new Error('Ошибка'), '', ['id1', 'id2'])
    );
    expect(state).toEqual({
      ...initialState,
      orderRequest: false,
      error: 'Ошибка'
    });
  });

  it('orderData обновляется при fetchOrderByNumber.fulfilled', () => {
    const fakeOrder: TOrder = { _id: '1', name: 'order' } as TOrder;
    const state = reducer(
      initialState,
      fetchOrderByNumber.fulfilled(fakeOrder, '', 1)
    );
    expect(state).toEqual({
      ...initialState,
      orderData: fakeOrder
    });
  });

  it('очищает orderData и error при clearOrder', () => {
    const prevState = {
      ...initialState,
      orderData: { _id: '1', name: 'order' } as TOrder,
      error: 'Ошибка'
    };
    const state = reducer(prevState, clearOrder());
    expect(state).toEqual({
      ...initialState,
      orderData: null,
      error: null
    });
  });
});
