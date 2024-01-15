import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userImage: null,
  components: [],
  _id: null,
  selectedComponent: null,
};

const defaultNewComponent = {
  parent: 0,
  x_position: 0,
  y_position: 0,
  z_index: 0,
  props: [],
  hooks: [],
  styles: [],
  html_tag: '<div>',
  inner_html: '',
  borderColor: '#000000',
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    startDesign: (state, action) => {
      state.userImage = action.payload;
      const mainContainer = {
        ...defaultNewComponent,
        name: 'MainContainer',
        parent: null,
        styles: [
          { key: 'height', value: '100vh' },
          { key: 'width', value: '100vw' },
        ],
      };
      if (state.components.length === 0) {
        state.components = [...state.components, mainContainer];
        state.created_at = new Date().toISOString();
      }
    },
    addComponent: (state, action) => {
      const newComponent = {
        ...defaultNewComponent,
        name: action.payload,
      };
      state.components = [...state.components, newComponent];
    },
    setParent: (state, action) => {
      const { childIdx, parentIdx } = action.payload;
      state.components[parentIdx].html_tag = '<div>';
      state.components[parentIdx].inner_html = '';
      state.components = state.components.map((item, idx) =>
        idx !== childIdx ? item : { ...item, parent: parentIdx }
      );
    },
    removeComponent: (state, action) => {
      const idx = action.payload;
      state.components.splice(idx, 1);
    },
    selectComponent: (state, action) => {
      state.selectedComponent = action.payload;
      console.log('this is selectComponent once handleRect dispatches', action.payload);
    },
    updateComponent: (state, action) => {
      const { idx, updatedComponent } = action.payload;
      state.components = state.components.map((item, i) =>
        i !== idx ? item : Object.assign(item, updatedComponent)
      );
    },
    resetDesign: () => initialState,
    retreveUserDesign: (state, action) => {
      const { _id, image_url, components } = action.payload;
      state._id = _id;
      state.userImage = image_url;
      state.components = components;
    },
    selectHtmlTag: (state, action) => {
      const { idx, html_tag } = action.payload;
      state.components = state.components.map((item, i) =>
        i !== idx ? item : { ...item, html_tag }
      );
    },
    updateComponentBorderColor: (state, action) => {
      const { name, borderColor } = action.payload;
      const componentIndex = state.components.findIndex(comp => comp.name === name);
      if (componentIndex !== -1) {
        state.components[componentIndex].borderColor = borderColor;
      }
    }
  },
});

export const {
  startDesign,
  addComponent,
  setParent,
  removeComponent,
  selectComponent,
  updateComponent,
  resetDesign,
  retreveUserDesign,
  selectHtmlTag,
  updateComponentBorderColor,
} = designSlice.actions;

export default designSlice.reducer;
