import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDesignRequest,
  addNewComponentRequest,
  deleteComponentRequest,
  getDesignDetailsRequest,
  // updateDesignRequest,
  updateComponentParentRequest,
  updateComponentHtmlTagRequest,
  submitComponentFormRequest,
  updateComponentRectanglePositionRequest,
  updateComponentRectangleStyleRequest,
} from '../fetchRequests';
import { Component, Design, HtmlTag, Rectangle } from '../../../../docs/types';

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body: { userImage: string; imageHeight: number }) =>
    await addDesignRequest(body)
);
// export const updateDesign = createAsyncThunk(
//   'designs/update/:designId',
//   async (arg: {
//     designId: number;
//     body: {
//       userImage: string;
//       imageToDelete?: string;
//       imageHeight?: number;
//       title?: string;
//       rootId?: number;
//     };
//   }) => await updateDesignRequest(arg.designId, arg.body)
// );
export const getDesignDetails = createAsyncThunk(
  'designs/detail/:designId',
  async (designId: number) => await getDesignDetailsRequest(designId)
);
export const addNewComponent = createAsyncThunk(
  'designs/new-component/:designId',
  async (arg: {
    designId: number;
    body: { index: number; rootId: number; name: string };
  }) => await addNewComponentRequest(arg.designId, arg.body)
);
export const deleteComponent = createAsyncThunk(
  'components/delete/:componentId',
  async (componentId: number) => await deleteComponentRequest(componentId)
);
export const updateComponentParent = createAsyncThunk(
  'components/update-parent/:componentId',
  async (arg: {
    componentId: number;
    body: { parentId: number; pageIdx: number };
  }) => await updateComponentParentRequest(arg.componentId, arg.body)
);

export const updateComponentHtmlTag = createAsyncThunk(
  'components/update-tag/:componentId',
  async (arg: { componentId: number; body: { htmlTag: HtmlTag } }) =>
    await updateComponentHtmlTagRequest(arg.componentId, arg.body)
);

export const submitComponentForm = createAsyncThunk(
  'components/submit/:componentId',
  async (arg: {
    componentId: number;
    body: {
      name: string;
      innerHtml: string;
      styles: { [key: string]: any };
      props: { [key: string]: any };
      pageIdx: number;
      htmlTag: HtmlTag;
    };
  }) => await submitComponentFormRequest(arg.componentId, arg.body)
);

export const updateComponentRectanglePosition = createAsyncThunk(
  'components/update-position/:componentId',
  async (arg: {
    componentId: number;
    body: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }) => await updateComponentRectanglePositionRequest(arg.componentId, arg.body)
);

export const updateComponentRectangleStyle = createAsyncThunk(
  'components/update-rectangle-style/:componentId',
  async (arg: {
    componentId: number;
    body: {
      styleToChange:
        | 'stroke'
        | 'backgroundColor'
        | 'borderWidth'
        | 'borderRadius';
      value: string | number;
    };
  }) => await updateComponentRectangleStyleRequest(arg.componentId, arg.body)
);

const asyncThunks = [
  newDesign,
  // updateDesign,
  getDesignDetails,
  addNewComponent,
  deleteComponent,
  updateComponentParent,
  updateComponentHtmlTag,
  submitComponentForm,
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
];

const designThunks = [newDesign, getDesignDetails];

const rectangleThunks = [
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
];

interface DesignState {
  _id: null | number;
  components: Component[];
  title: string;
  image_url: string | null;
  created_at: Date | null;
  last_updated: Date | null;
  loading: boolean;
  error: string | undefined;
  searchTerm: string;
  isDraggable: boolean;
  cursorMode: string;
}

const initialState: DesignState = {
  _id: null,
  components: [],
  title: 'Untitled',
  image_url: null,
  created_at: null,
  last_updated: null,
  loading: false,
  error: undefined,
  searchTerm: '',
  isDraggable: false,
  cursorMode: 'default',
};

const designSliceV2 = createSlice({
  name: 'design_v2',
  initialState,
  reducers: {
    resetDesign: () => initialState,
    updateRootHeight: (state, action: PayloadAction<number>) => {
      if (state.components.length > 0) {
        if (!state.components[0].rectangle) {
          state.error = "Design's root component has no rectangle.";
        } else {
          state.components[0].rectangle.height = action.payload;
        }
      } else {
        state.error = 'Design has no components.';
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleIsDraggable: (state, action: PayloadAction<boolean>) => {
      state.isDraggable = action.payload;
    },
    setCursorMode: (state, action: PayloadAction<string>) => {
      state.cursorMode = action.payload;
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
      builder.addCase(
        thunk.fulfilled,
        (state, action: PayloadAction<Design>) => {
          Object.assign(state, action.payload);
          state.loading = false;
        }
      );
    });
    rectangleThunks.forEach((thunk) => {
      builder.addCase(
        thunk.fulfilled,
        (state, action: PayloadAction<Rectangle>) => {
          state.loading = false;
          const updatedRectangle = action.payload;
          console.log('updatedRectangle is', updatedRectangle);
          const index = state.components.findIndex(
            (item) => item._id === updatedRectangle.component_id
          );
          state.components[index].rectangle = updatedRectangle;
        }
      );
    });
    builder.addCase(
      addNewComponent.fulfilled,
      (state, action: PayloadAction<Component>) => {
        state.loading = false;
        state.components.push(action.payload);
      }
    );
    builder
      .addCase(
        deleteComponent.fulfilled,
        (
          state,
          action: PayloadAction<{
            shifted: Array<{ _id: number; index: number }>;
            indexDeleted: number;
          }>
        ) => {
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
        }
      )
      .addCase(
        updateComponentParent.fulfilled,
        (
          state,
          action: PayloadAction<{ componentId: number; parentId: number }>
        ) => {
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
        }
      )
      .addCase(updateComponentHtmlTag.fulfilled, (state, action) => {
        state.loading = false;
        const { componentName, htmlTag } = action.payload;
        state.components.forEach((item) => {
          if (item.name == componentName) item.html_tag = htmlTag;
        });
      });
    // .addCase(submitComponentForm.fulfilled, (state, action) => {
    //   state.loading = false;
    //   const updatedComponent = action.payload;
    //   console.log('updatedComponent', updatedComponent);
    //   state.components.forEach((item) => {
    //     if (item._id == updatedComponent._id) {
    //       Object.assign(item, updatedComponent);
    //     }
    //     if (item.name === updatedComponent.name) {
    //       item.inner_html = updatedComponent.inner_html;
    //     }
    //   });
    // });
  },
});

export const {
  resetDesign,
  setSearchTerm,
  updateRootHeight,
  toggleIsDraggable,
  setCursorMode,
} = designSliceV2.actions;
export default designSliceV2.reducer;
