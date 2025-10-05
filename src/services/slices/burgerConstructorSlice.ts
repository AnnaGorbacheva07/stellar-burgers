import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type TBurgerConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};
const initialState: TBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    getConstructorState: (state) => state
  },
  reducers: {
    //устанавливает булочку для бургера
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    removeBun: (state) => {
      state.constructorItems.bun = null;
      // Очищаем ингредиенты при удалении булки
      state.constructorItems.ingredients = [];
    },
    /*
    // Добавляем ингредиент
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },*/
    /*
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredientWithUuid = { ...action.payload, id: uuidv4() };
      state.constructorItems.ingredients.push(ingredientWithUuid);
    },*/
    // Используем prepare для генерации UUID
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TConstructorIngredient) {
        const ingredientWithUuid = { ...ingredient, id: uuidv4() };
        return {
          payload: ingredientWithUuid
        };
      }
    },
    //удаляет ингредиент по его id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    //  очищение всего конструктора
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    // установка состояния запроса
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    //устанавливает данные для модального окна заказа

    setOrderModalData: (state, action: PayloadAction<any>) => {
      state.orderModalData = action.payload;
    },

    // сброс данных модального окна
    resetOrderModal: (state) => {
      state.orderModalData = null;
    },

    // Перемещает ингредиент вверх
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload;

      if (index > 0) {
        const movedIngredient = ingredients.splice(index - 1, 1)[0];
        ingredients.splice(index, 0, movedIngredient);
      }
    },

    // Перемещает ингредиент вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload;

      if (index < ingredients.length - 1) {
        const movedIngredient = ingredients.splice(index + 1, 1)[0];
        ingredients.splice(index, 0, movedIngredient);
      }
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData,
  resetOrderModal,
  moveIngredientUp,
  moveIngredientDown,
  removeBun
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
