import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { clearOrder, createOrder } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из стора
  const { constructorItems, orderRequest } = useSelector(
    (state) => state.burgerConstructor
  );

  const orderModalData = useSelector((state) => state.orders.orderData);
  /*const user = useSelector((state: RootState) => state.user);*/
  const { isAuthenticated } = useSelector((state) => state.user);

  const onOrderClick = () => {
    // Если не авторизован — отправка на страницу логина
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    // После успешного заказа очищаю конструктор
    if (orderModalData) {
      dispatch(clearConstructor());
      // Сбрасываю данные заказа
      dispatch(clearOrder());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
