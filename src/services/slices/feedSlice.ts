import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  feed: TOrdersData | null;
}

const initialState: FeedState = {
  orders: [],
  isLoading: false,
  error: null,
  feed: null
};
/*export const fetchFeed = createAsyncThunk('feeds/fetchFeed', getFeedsApi);*/
export const fetchFeed = createAsyncThunk('feeds/fetchFeed', async () => {
  try {
    const response = await getFeedsApi();
    console.log('Полученные данные:', response);
    return response;
  } catch (error) {
    throw error;
  }
});

export const fetchProfileOrders = createAsyncThunk(
  'feeds/fetchProfileOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchFeed.fulfilled, (state, action) => {
        console.log('Данные из action:', action.payload); // Добавляем логирование
        state.isLoading = false;
        state.feed = action.payload;
        // Возможно, нужно обновить orders
        state.orders = action.payload.orders || [];
      })

      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  }
});

export default feedSlice.reducer;
