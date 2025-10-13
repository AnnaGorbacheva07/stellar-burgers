import reducer, {
  fetchIngredients,
  initialState,
  IIngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Краторный соус',
  type: 'sauce',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 20,
  price: 25,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides
});

describe('ingredientsSlice', () => {
  it('должен устанавливать флаг загрузки в true при fetchIngredients.pending', () => {
    const state = reducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  it('должен сохранять ингредиенты и сбрасывать флаг загрузки при fetchIngredients.fulfilled', () => {
    const items: TIngredient[] = [
      createIngredient({ _id: '1', name: 'Булка', type: 'bun' }),
      createIngredient({ _id: '2', name: 'Начинка', type: 'main' })
    ];

    const state = reducer(
      initialState,
      fetchIngredients.fulfilled(items, '', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      ingredients: items,
      isLoading: false
    });
  });

  it('должен сохранять ошибку и сбрасывать флаг загрузки при fetchIngredients.rejected', () => {
    const error = new Error('Ошибка загрузки');

    const state = reducer(
      initialState,
      fetchIngredients.rejected(error, '', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
