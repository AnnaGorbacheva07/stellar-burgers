import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useEffect, useState } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  fetchUserProfile,
  setAuthChecked
} from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigator = useNavigate();
  const [state, setState] = useState({ background: null });

  useEffect(() => {
    // Загрузка ингредиентов
    dispatch(fetchIngredients());
    dispatch(fetchUserProfile()).finally(() => dispatch(setAuthChecked(true)));
  }, [dispatch]);

  // Функция закрытия модального окна
  const handleCloseModal = () => {
    navigator(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        {/* Открытые маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        {/* 404 страница */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          {/* Модальные окна */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
