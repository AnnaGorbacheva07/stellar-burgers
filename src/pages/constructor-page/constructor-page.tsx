import { AppDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Получаем состояние из стора
  const { isLoading, error, ingredients } = useSelector(
    (state) => state.ingredients
  );
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Добавляем проверку на наличие ингредиентов
  if (!ingredients || ingredients.length === 0) {
    return <Preloader />;
  }

  if (error) {
    return <div>Произошла ошибка при загрузке ингредиентов: {error}</div>;
  }

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
/*
export const ConstructorPage: FC = () => {
  
  const isIngredientsLoading = false;

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};*/
