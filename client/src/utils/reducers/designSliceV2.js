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
} from '../fetchRequests';

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body) => await addDesignRequest(body)
);
export const updateDesign = createAsyncThunk(
  'designs/update/:designId',
  async ({ designId, body }) => await updateDesignRequest(designId, body)
);
export const getDesignDetails = createAsyncThunk(
  'designs/detail/:designId',
  async (designId) => await getDesignDetailsRequest(designId)
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
};

const designSliceV2 = createSlice({
  name: 'design_v2',
  initialState,
  reducers: { resetDesign: () => initialState },
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
        const { componentId, htmlTag } = action.payload;
        state.components.forEach((item) => {
          if (item._id == componentId) item.html_tag = htmlTag;
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
        });
      });
  },
});

export const { resetDesign } = designSliceV2.actions;

export default designSliceV2.reducer;
