import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { clearConstructor } from './burgerConstructorSlice';

export type TOrdersState = {
  orders: TOrder[];
  orderData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  orderData: null,
  orderRequest: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    // Отправляю заказ на сервер
    const data = await orderBurgerApi(ingredientIds);

    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/ byNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  selectors: {
    getOrderState: (state) => state
  },
  reducers: {
    // Очищаем текущий заказ
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось получить заказ';
      });
  }
});

// Экспортируем экшены
export const { clearOrder } = orderSlice.actions;

export const { getOrderState } = orderSlice.selectors;
// Экспортируем редьюсер
export default orderSlice.reducer;
