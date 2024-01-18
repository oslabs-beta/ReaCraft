import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addDesignRequest,
  addNewComponentRequest,
  deleteComponentRequest,
  getDesignDetailsRequest,
  updateDesignRequest,
  updateComponentParentRequest,
  updateComponentHtmlTagRequest,
  submitComponentFormRequest,
  updateComponentRectangleRequest,
} from '../fetchRequests';

const normalizeRectangle = (rectangle) => ({
  ...rectangle,
  x: Number(rectangle.x_position),
  y: Number(rectangle.y_position),
  width: Number(rectangle.width),
  height: Number(rectangle.height),
  isResizeable: rectangle.isresizable === 'true',
  stroke: rectangle.stroke || '#000',
});

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body, { dispatch }) => {
    const response = await addDesignRequest(body);
    dispatch(designSliceV2.actions.setIsPastDesign(false));
    return response;
}
);
export const updateDesign = createAsyncThunk(
  'designs/update/:designId',
  async ({ designId, body }) => await updateDesignRequest(designId, body)
);
export const getDesignDetails = createAsyncThunk(
  'designs/detail/:designId',
  async (designId, { dispatch }) => {
    const response = await getDesignDetailsRequest(designId);
    response.components.forEach(component => {
      if (component.rectangle) {
        console.log('this is component.rectangle from getdesign', component.rectangle);
        component.rectangle = normalizeRectangle(component.rectangle);
      }
    });
    dispatch(designSliceV2.actions.setIsPastDesign(true));
    console.log('this is the response', response);
    return response;
}
);
export const addNewComponent = createAsyncThunk(
  'designs/new-component/:designId',
  async ({ designId, body }) => await addNewComponentRequest(designId, body)
);
export const deleteComponent = createAsyncThunk(
  'components/delete/:componentId',
  async (componentId) => await deleteComponentRequest(componentId)
);
export const updateComponentParent = createAsyncThunk(
  'components/update-parent/:componentId',
  async ({ componentId, body }) =>
    await updateComponentParentRequest(componentId, body)
);

export const updateComponentHtmlTag = createAsyncThunk(
  'components/update-tag/:componentId',
  async ({ componentId, body }) =>
    await updateComponentHtmlTagRequest(componentId, body)
);

export const updateComponentRectangle = createAsyncThunk(
  'components/update-position/:componentId',
  async ({ componentId, body }) => {
    console.log('this is dispatch from updateComponentRectangle', componentId, body);
    const response = await updateComponentRectangleRequest(componentId, body);
    console.log('this is the response from fetch request: component_id', componentId, 'this is the response:', response);
    return { componentId: componentId, body: response };
  }
);

export const submitComponentForm = createAsyncThunk(
  'components/submit/:componentId',
  async ({ componentId, body }) =>
    await submitComponentFormRequest(componentId, body)
);

const asyncThunks = [
  newDesign,
  updateDesign,
  getDesignDetails,
  addNewComponent,
  deleteComponent,
  updateComponentParent,
  updateComponentHtmlTag,
  updateComponentRectangle,
  submitComponentForm,
];

const designThunks = [newDesign, updateDesign, getDesignDetails];

const initialState = {
  _id: null,
  components: [],
  title: 'Untitled',
  image_url: null,
  created_at: null,
  last_updated: null,
  loading: false,
  error: null,
  borderColor: '#000000',
  isPastDesign: false,
};

const designSliceV2 = createSlice({
  name: 'design_v2',
  initialState,
  reducers: {
    resetDesign: () => initialState,
    updateComponentBorderColor: (state, action) => {
      const { id, borderColor } = action.payload;
      // find component with the given _id and update its border color
      const component = state.components.find((comp) => comp._id === id);
      if (component) {
        component.borderColor = borderColor;
      }
    },

    setIsPastDesign: (state, action) => {
      state.isPastDesign = action.payload;
    },
   },
  extraReducers: (builder) => {
    asyncThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    });
    designThunks.forEach((thunk) => {
      builder.addCase(thunk.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        console.log('this is action.payload in designThunks', action.payload);
        state.loading = false;
      });
    });
    builder.addCase(addNewComponent.fulfilled, (state, action) => {
      state.loading = false;
      state.components.push(action.payload);
    });
    builder
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.loading = false;
        const { shifted, indexDeleted } = action.payload;
        state.components = state.components.filter(
          (item) => item.index !== indexDeleted
        );
        shifted.forEach(({ _id, index }) => {
          const component = state.components.find((item) => item._id === _id);
          if (component) {
            component.index = index;
          }
        });
      })
      .addCase(updateComponentParent.fulfilled, (state, action) => {
        state.loading = false;
        const { componentId, parentId } = action.payload;
        state.components.forEach((item) => {
          if (item._id == componentId) {
            item.parent_id = parentId;
          } else if (item._id == parentId) {
            item.html_tag = '<div>';
            item.inner_html = '';
          }
        });
      })
      .addCase(updateComponentHtmlTag.fulfilled, (state, action) => {
        state.loading = false;
        const { componentName, htmlTag } = action.payload;
        state.components.forEach((item) => {
          if (item.name == componentName) item.html_tag = htmlTag;
        });
      })
      .addCase(submitComponentForm.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComponent = action.payload;
        console.log('uploaded : ', updatedComponent);
        state.components.forEach((item, idx) => {
          if (item._id == updatedComponent._id) {
            state.components[idx] = updatedComponent;
          }
          if (item.name === updatedComponent.name) {
            item.inner_html = updatedComponent.inner_html;
          }
        });
      })
      .addCase(updateComponentRectangle.fulfilled, (state, action) => {
        console.log('updateComponentRectangle fulfilled');
        state.loading = false;
        const { componentId, body } = action.payload;
        console.log('this is the action.payload from addCase', body);
        const componentIndex = state.components.findIndex(component => component._id === componentId);
        console.log('this is the componentIndex', componentIndex);
        if (componentIndex !== -1) {
          console.log('if statement in updateComponentRect fulfilled passed');
          state.components[componentIndex].rectangle = {
            x: +body.updatedComponent.x_position,
            y: +body.updatedComponent.y_position,
            width: +body.updatedComponent.width,
            height: +body.updatedComponent.height,
            isResizeable: body.updatedComponent.isresizable,
            stroke: body.updatedComponent.stroke,
          };
        }
      });
  },
});


export const { resetDesign, updateComponentBorderColor, setIsPastDesign } = designSliceV2.actions;

export default designSliceV2.reducer;
