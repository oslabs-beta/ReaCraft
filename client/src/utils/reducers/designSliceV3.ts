import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDesignRequest,
  updateDesignTitleRequest,
  getDesignDetailsRequest,
  addNewComponentRequest,
  deleteComponentRequest,
  updateComponentParentRequest,
  submitComponentFormRequest,
} from '../fetchRequests';
import { Component, Design, HtmlTag, Page } from '../../../../docs/types';

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body: { userImage: string; imageHeight: number }) =>
    await addDesignRequest(body)
);

export const updateDesignTitle = createAsyncThunk(
  'designs/update-title/:designId',
  async (arg: { designId: number; body: { title: string } }) =>
    await updateDesignTitleRequest(arg.designId, arg.body)
);

export const getDesignDetails = createAsyncThunk(
  'designs/detail/:designId',
  async (designId: number) => await getDesignDetailsRequest(designId)
);

export const addNewComponent = createAsyncThunk(
  'pages/new-component/:pageId',
  async (arg: {
    pageId: number;
    body: { index: number; rootId: number; name: string };
  }) => await addNewComponentRequest(arg.pageId, arg.body)
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

const asyncThunks = [
  newDesign,
  updateDesignTitle,
  getDesignDetails,
  addNewComponent,
  deleteComponent,
  submitComponentForm,
];

const designThunks = [newDesign, updateDesignTitle, getDesignDetails];

interface DesignState {
  _id: null | number;
  pages: Page[];
  title: string;
  created_at: Date | null;
  last_updated: Date | null;
  loading: boolean;
  error: string | undefined;
  searchTerm: string;
  isDraggable: boolean;
  cursorMode: string;
  image_url: string;
}

const initialState: DesignState = {
  _id: null,
  pages: [],
  title: 'Untitled',
  created_at: null,
  last_updated: null,
  image_url: '',
  loading: false,
  error: undefined,
  searchTerm: '',
  isDraggable: false,
  cursorMode: 'default',
};

const designSliceV3 = createSlice({
  name: 'design_v3',
  initialState,
  reducers: {
    resetDesign: () => initialState,
    updateRootHeight: (
      state: DesignState,
      action: PayloadAction<{ pageIndex: number; height: number }>
    ) => {
      const { pageIndex, height } = action.payload;
      if (state.pages.length === 0) {
        state.error = 'Design has no pages.';
        return;
      }
      if (!state.pages[pageIndex]) {
        state.error = 'Design has no page ' + pageIndex;
        return;
      }
      if (state.pages[pageIndex].components.length === 0) {
        state.error = `Design's page ${pageIndex} has no components.`;
        return;
      }
      const root = state.pages[pageIndex].components[0];
      if (!root.rectangle) {
        state.error = `Design's page ${pageIndex} has no root rectangle.`;
        return;
      }
      root.rectangle.height = height;
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
    builder
      .addCase(
        addNewComponent.fulfilled,
        (state, action: PayloadAction<Component>) => {
          state.loading = false;
          const pageIndex = state.pages.findIndex(
            (page) => page._id === action.payload.page_id
          );
          state.pages[pageIndex].components.push(action.payload);
        }
      )
      .addCase(
        deleteComponent.fulfilled,
        (
          state,
          action: PayloadAction<{
            shifted: Array<{ _id: number; index: number }>;
            indexDeleted: number;
            pageId: number;
          }>
        ) => {
          state.loading = false;
          const { shifted, indexDeleted, pageId } = action.payload;
          const page = state.pages.find((item) => item._id === pageId);
          if (!page) {
            state.error = 'Delete component: page not found';
            return;
          }
          const components = page.components;
          components.splice(indexDeleted, 1);
          shifted.forEach(({ _id, index }) => {
            const component = components.find((item) => item._id === _id);
            if (component) {
              component.index = index;
            }
          });
        }
      )
      .addCase(
        updateComponentParent.fulfilled,
        (
          state: DesignState,
          action: PayloadAction<{
            componentId: number;
            parentId: number;
            pageIdx: number;
            parentName: string;
          }>
        ) => {
          state.loading = false;
          const { componentId, parentId, parentName, pageIdx } = action.payload;
          const child = state.pages[pageIdx].components.find(
            (item) => item._id == componentId
          );
          console.log('child', child);
          if (!child) {
            state.error = 'updateComponentParent: component not found';
            return;
          }
          child.parent_id = parentId;

          state.pages.forEach((page) => {
            const components = page.components;
            components.forEach((item) => {
              if (item.name === parentName) {
                item.html_tag = '<div>';
                item.inner_html = '';
              }
            });
          });
        }
      )
      .addCase(
        submitComponentForm.fulfilled,
        (
          state: DesignState,
          action: PayloadAction<{
            updatedComponent: Component;
            pageIdx: number;
          }>
        ) => {
          state.loading = false;
          const { updatedComponent, pageIdx } = action.payload;
          const compIdx = state.pages[pageIdx].components.findIndex(
            (item: Component) => item._id === updatedComponent._id
          );
          const component = state.pages[pageIdx].components[compIdx];
          state.pages[pageIdx].components[compIdx] = Object.assign(
            component,
            updatedComponent
          );
          state.pages.forEach((page: Page) => {
            const components = page.components;
            components.forEach((item: Component) => {
              if (item.name === updatedComponent.name) {
                item.html_tag = updatedComponent.html_tag;
                item.inner_html = updatedComponent.inner_html;
              }
            });
          });
        }
      );
  },
});

export const {
  resetDesign,
  setSearchTerm,
  updateRootHeight,
  toggleIsDraggable,
  setCursorMode,
} = designSliceV3.actions;
export default designSliceV3.reducer;
