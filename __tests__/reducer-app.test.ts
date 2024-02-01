import appReducer, {
  AppState,
  Message,
  goToPage,
  resetApp,
  resetMessage,
  setCursorMode,
  setMessage,
  setSelectedIdx,
  setSelectedPageIdx,
  setWindowSize,
  setZoom,
  toggleIsDraggable,
} from '../client/src/utils/reducers/appSlice';

describe('appSlice', () => {
  const appState: AppState = {
    message: null,
    page: 'HOME',
    selectedPageIdx: null,
    selectedIdx: null,
    windowHeight: 1024,
    windowWidth: 1366,
    zoom: 100,
    isDraggable: false,
    cursorMode: 'default',
  };

  it('should handle setMessage', () => {
    const message: Message = { severity: 'success', text: 'Test message' };
    const nextState = appReducer(appState, setMessage(message));
    expect(nextState.message).toEqual(message);
  });

  it('should handle setZoom', () => {
    const nextState = appReducer(appState, setZoom(80));
    expect(nextState.zoom).toBe(80);
  });

  it('should handle resetMessage', () => {
    const appStateWithMessage: AppState = {
      ...appState,
      message: { severity: 'success', text: 'Test message' },
    };
    const nextState = appReducer(appStateWithMessage, resetMessage());
    expect(nextState.message).toBe(null);
  });

  it('should handle setWindowSize', () => {
    const nextState = appReducer(
      appState,
      setWindowSize({ height: 100, width: 200 })
    );
    expect(nextState.windowHeight).toBe(100);
    expect(nextState.windowWidth).toBe(200);
  });

  it('should handle goToPage', () => {
    const nextState = appReducer(appState, goToPage('DESIGN'));
    expect(nextState.page).toBe('DESIGN');
  });

  it('should handle resetApp', () => {
    const testAppState: AppState = {
      message: { severity: 'success', text: 'Test message' },
      page: 'DESIGN',
      selectedPageIdx: 0,
      selectedIdx: 1,
      windowHeight: 100,
      windowWidth: 200,
      zoom: 50,
      isDraggable: true,
      cursorMode: 'default',
    };
    const nextState = appReducer(testAppState, resetApp());
    expect(nextState).toEqual(appState);
  });

  it('should handle setSelectedIdx', () => {
    const nextState = appReducer(appState, setSelectedIdx(5));
    expect(nextState.selectedIdx).toBe(5);
  });

  it('should handle setSelectedPageIdx', () => {
    const nextState = appReducer(appState, setSelectedPageIdx(8));
    expect(nextState.selectedPageIdx).toBe(8);
  });

  it('should handle toggleIsDraggable', () => {
    const nextState = appReducer(appState, toggleIsDraggable(true));
    expect(nextState.isDraggable).toBe(true);
  });

  it('should handle setCursorMode', () => {
    const nextState = appReducer(appState, setCursorMode('pan'));
    expect(nextState.cursorMode).toBe('pan');
  });
});
