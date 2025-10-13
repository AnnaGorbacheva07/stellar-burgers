import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    const resultState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(resultState).toEqual(initialState);
  });
});
