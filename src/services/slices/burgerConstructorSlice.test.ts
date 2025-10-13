import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown,
  TBurgerConstructorState
} from './burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Мокаем uuid
jest.mock('uuid', () => ({
  v4: jest.fn()
}));
const mockedUuid = uuidv4 as jest.MockedFunction<typeof uuidv4>;

// Вспомогательная функция для ингредиента
const createIngredient = (
  overrides: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
  _id: 'test-id',
  name: 'Ингредиент',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  id: 'default-id',
  ...overrides
});

// Начальное состояние конструктора
const createInitialState = (): TBurgerConstructorState => ({
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
});

describe('burgerConstructorSlice', () => {
  beforeEach(() => {
    mockedUuid.mockReset();
  });

  it('должен добавлять начинку в список ингредиентов', () => {
    mockedUuid.mockReturnValue('filling-uuid');
    const filling = createIngredient({
      _id: 'main-1',
      name: 'Начинка',
      type: 'main'
    });

    const state = burgerConstructorSlice.reducer(
      createInitialState(),
      addIngredient(filling)
    );

    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...filling,
      id: 'filling-uuid'
    });
  });

  it('должен удалять ингредиент по id', () => {
    const startState: TBurgerConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: [
          { ...createIngredient({ name: 'Первый' }), id: 'id-1' },
          { ...createIngredient({ name: 'Второй' }), id: 'id-2' }
        ]
      },
      orderRequest: false,
      orderModalData: null
    };

    const state = burgerConstructorSlice.reducer(
      startState,
      removeIngredient('id-1')
    );

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0].id).toBe('id-2');
  });

  it('должен менять порядок ингредиентов', () => {
    const startState: TBurgerConstructorState = {
      constructorItems: {
        bun: null,
        ingredients: [
          { ...createIngredient({ name: 'Первый' }), id: 'id-1' },
          { ...createIngredient({ name: 'Второй' }), id: 'id-2' },
          { ...createIngredient({ name: 'Третий' }), id: 'id-3' }
        ]
      },
      orderRequest: false,
      orderModalData: null
    };

    // Перемещение  вверх
    const stateUp = burgerConstructorSlice.reducer(
      startState,
      moveIngredientUp(1)
    );
    expect(stateUp.constructorItems.ingredients.map((i) => i.id)).toEqual([
      'id-2',
      'id-1',
      'id-3'
    ]);

    // Перемещение первого вверх (ничего не меняется)
    const stateUpEdge = burgerConstructorSlice.reducer(
      startState,
      moveIngredientUp(0)
    );
    expect(stateUpEdge.constructorItems.ingredients.map((i) => i.id)).toEqual([
      'id-1',
      'id-2',
      'id-3'
    ]);

    // Перемещение второго вниз
    const stateDown = burgerConstructorSlice.reducer(
      startState,
      moveIngredientDown(1)
    );
    expect(stateDown.constructorItems.ingredients.map((i) => i.id)).toEqual([
      'id-1',
      'id-3',
      'id-2'
    ]);
  });

  it('должен очищать конструктор', () => {
    const startState: TBurgerConstructorState = {
      constructorItems: {
        bun: createIngredient({ type: 'bun', name: 'Булка' }),
        ingredients: [
          { ...createIngredient({ name: 'Начинка' }), id: 'main-id' }
        ]
      },
      orderRequest: true,
      orderModalData: null
    };

    const state = burgerConstructorSlice.reducer(
      startState,
      clearConstructor()
    );

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: true,
      orderModalData: null
    });
  });
});
