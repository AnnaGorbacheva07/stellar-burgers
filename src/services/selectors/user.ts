import { RootState } from '../store';

export const selectUserState = (state: RootState) => state.user;

export const selectUser = (state: RootState) => state.user.user;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthenticated;

export const selectUserError = (state: RootState) => state.user.error;
