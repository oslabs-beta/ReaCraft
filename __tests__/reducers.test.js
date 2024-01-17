import appReducer, { setMessage, resetMessage, goToPage, resetApp } from '../client/src/utils/reducers/appSlice.js';

describe('appSlice reducer', () => {
    it('should handle setMessage', () => {
      const initialState = { message: null, page: 'HOME' };
      const newState = appReducer(initialState, setMessage('New Message'));
      expect(newState.message).toEqual('New Message');
      expect(newState.page).toEqual('HOME');
    });
  
    it('should handle resetMessage', () => {
      const initialState = { message: 'Existing Message', page: 'HOME' };
      const newState = appReducer(initialState, resetMessage());
      expect(newState.message).toEqual(null);
      expect(newState.page).toEqual('HOME');
    });
  
    it('should handle goToPage', () => {
      const initialState = { message: null, page: 'HOME' };
      const newState = appReducer(initialState, goToPage('ABOUT'));
      expect(newState.message).toEqual(null);
      expect(newState.page).toEqual('ABOUT');
    });
  
    it('should handle resetApp', () => {
      const initialState = { message: 'Existing Message', page: 'ABOUT' };
      const newState = appReducer(initialState, resetApp());
      expect(newState).toEqual({ message: null, page: 'HOME' });
    });

    it('should have the correct initial state', () => {
        const initialState = { message: null, page: 'HOME' };
        const state = appReducer(undefined, {});
        expect(state).toEqual(initialState);
    });

    it('should return the current state for unknown action', () => {
        const currentState = { message: 'Test', page: 'ABOUT' };
        const state = appReducer(currentState, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(currentState);
    });

    it('should return a new state object', () => {
        const currentState = { message: 'Test', page: 'ABOUT' };
        const action = setMessage('New Message');
        const state = appReducer(currentState, action);
        expect(state).not.toBe(currentState);
    });

    it('should reset the state to initial state on resetApp action', () => {
        const currentState = { message: 'Test', page: 'ABOUT' };
        const action = resetApp();
        const state = appReducer(currentState, action);
        expect(state).toEqual(appReducer(undefined, {}));
    });

    it('should handle a sequence of actions', () => {
        const initialState = { message: null, page: 'HOME' };
        const newState = appReducer(initialState, [
          setMessage('New Message'),
          goToPage('ABOUT'),
        ]);
        expect(newState).toEqual({ message: 'New Message', page: 'ABOUT' });
    });

  });