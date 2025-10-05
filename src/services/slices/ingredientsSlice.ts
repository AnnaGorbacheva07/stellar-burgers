import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Создаем thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      throw new Error('Ошибка при загрузке ингредиентов');
    }
  }
);

export type IIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsState: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      // Обработчик начала загрузки
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработчик успешного завершения
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        console.log('Полученные ингредиенты:', action.payload);
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      // Обработчик ошибки
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = state.error = action.error?.message || null;
      });
  }
});

export const { getIngredientsState } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
