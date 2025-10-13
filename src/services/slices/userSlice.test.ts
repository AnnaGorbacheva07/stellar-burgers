import { TLoginData, TRegisterData } from '@api';
import reducer, {
  registerUser,
  logoutUser,
  fetchUserProfile,
  setUserChecked
} from './userSlice';
import { TUser } from '@utils-types';

const initialState = reducer(undefined, { type: '@@INIT' });

const fakeRegisterData: TRegisterData = {
  email: 'test@mail.com',
  password: '123456',
  name: 'Test'
};

describe('userSlice', () => {
  it('isLoading становится true при registerUser.pending', () => {
    const state = reducer(
      initialState,
      registerUser.pending('', fakeRegisterData)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('user обновляется при registerUser.fulfilled', () => {
    const fakeUser: TUser = { email: 'test@mail.com', name: 'Test' } as TUser;
    const state = reducer(
      initialState,
      registerUser.fulfilled(fakeUser, '', fakeRegisterData)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      user: fakeUser
    });
  });

  it('записывает ошибку при registerUser.rejected', () => {
    const state = reducer(
      initialState,
      registerUser.rejected(new Error('Ошибка'), '', fakeRegisterData)
    );
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка'
    });
  });

  it('isUserChecked становится true при setUserChecked', () => {
    const state = reducer(initialState, setUserChecked());
    expect(state.isUserChecked).toBe(true);
  });

  it('isAuthenticated становится true при fetchUserProfile.fulfilled', () => {
    const fakeUser: TUser = { email: 'test@mail.com', name: 'Test' } as TUser;
    const state = reducer(
      initialState,
      fetchUserProfile.fulfilled(fakeUser, '', undefined)
    );
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(fakeUser);
  });

  it('isAuthenticated становится false при fetchUserProfile.rejected', () => {
    const state = reducer(
      { ...initialState, isAuthenticated: true },
      fetchUserProfile.rejected(new Error('Ошибка'), '', undefined)
    );
    expect(state.isAuthenticated).toBe(false);
  });

  it('user становится null при logoutUser.fulfilled', () => {
    const prevState = {
      ...initialState,
      user: { email: 'test@mail.com', name: 'Test' } as TUser,
      isAuthenticated: true
    };
    const state = reducer(
      prevState,
      logoutUser.fulfilled(undefined, '', undefined)
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
