import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import {
  addIngredient,
  setBun
} from '../../services/slices/burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      // Проверяем, является ли ингредиент булкой
      if (ingredient.type === 'bun') {
        dispatch(
          setBun({
            ...ingredient,
            id: ingredient._id
          })
        );
      } else {
        dispatch(
          addIngredient({
            ...ingredient,
            id: ingredient._id
          })
        );
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
