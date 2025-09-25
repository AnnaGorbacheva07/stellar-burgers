import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredientDown,
  moveIngredientUp,
  removeBun,
  removeIngredient
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };
    // Перемещение начинки
    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };
    //Удаление начинки
    const handleClose = () => {
      // Проверяем, является ли удаляемый элемент булкой
      if (ingredient.type === 'bun') {
        dispatch(removeBun());
      } else {
        dispatch(removeIngredient(ingredient.id));
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
