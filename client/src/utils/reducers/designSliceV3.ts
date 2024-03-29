import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDesignRequest,
  getDesignDetailsRequest,
  addNewComponentRequest,
  deleteComponentRequest,
  updateComponentParentRequest,
  submitComponentFormRequest,
  updateComponentRectanglePositionRequest,
  updateComponentRectangleStyleRequest,
  deletePageRequest,
  addNewPageRequest,
  updateDesignCoverOrTitleRequest,
} from '../fetchRequests';
import { setMessage, setSelectedPageIdx, goToPage } from './appSlice';
import {
  Component,
  Design,
  HtmlTag,
  Page,
  Rectangle,
} from '../../../../docs/types';

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body: { userImage: string; imageHeight: number; clientId: string }) =>
    await addDesignRequest(body)
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

export const updateComponentRectanglePosition = createAsyncThunk(
  'components/update-position/:componentId',
  async (arg: {
    componentId: number;
    body: {
      x: number;
      y: number;
      width: number;
      height: number;
      pageIdx: number;
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
        | 'background_color'
        | 'border_width'
        | 'border_radius';
      value: string | number;
      pageIdx: number;
    };
  }) => await updateComponentRectangleStyleRequest(arg.componentId, arg.body)
);

export const deletePage = createAsyncThunk(
  'pages/delete/:pageId',
  async (pageId: number) => await deletePageRequest(pageId)
);

export const addNewPage = createAsyncThunk(
  'designs/add-page/:designId',
  async (arg: {
    designId: number;
    body: {
      pageIdx: number;
      userImage: string;
      imageHeight: number;
      clientId: string;
    };
  }) => await addNewPageRequest(arg.designId, arg.body)
);

const asyncThunks = [
  newDesign,
  getDesignDetails,
  addNewComponent,
  deleteComponent,
  submitComponentForm,
  updateComponentParent,
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
  deletePage,
  addNewPage,
];

const designThunks = [newDesign, getDesignDetails];

const rectangleThunks = [
  updateComponentRectanglePosition,
  updateComponentRectangleStyle,
];
export interface DesignState {
  _id: null | number;
  pages: Page[];
  title: string;
  created_at: Date | null;
  last_updated: Date | null;
  loading: boolean;
  error: string | undefined;
  image_url: string;
  canEdit: Boolean;
}

export const initialDesignState: DesignState = {
  _id: null,
  pages: [],
  title: 'Untitled',
  created_at: null,
  last_updated: null,
  image_url: '',
  loading: false,
  error: undefined,
  canEdit: true,
};

const designSliceV3 = createSlice({
  name: 'design_v3',
  initialState: initialDesignState,
  reducers: {
    resetDesign: () => initialDesignState,
    updateRootHeight: (
      state: DesignState,
      action: PayloadAction<{ pageIdx: number; height: number }>
    ) => {
      const { pageIdx, height } = action.payload;
      if (state.pages.length === 0) {
        state.error = 'Design has no pages.';
        return;
      }
      if (!state.pages[pageIdx]) {
        state.error = 'Design has no page ' + pageIdx;
        return;
      }
      if (state.pages[pageIdx].components.length === 0) {
        state.error = `Design's page ${pageIdx} has no components.`;
        return;
      }
      const root = state.pages[pageIdx].components[0];
      if (!root.rectangle) {
        state.error = `Design's page ${pageIdx} has no root rectangle.`;
        return;
      }
      root.rectangle.height = height;
    },
    updateDesignTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setCanEdit: (state, action: PayloadAction<Boolean>) => {
      state.canEdit = action.payload;
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
        (
          state,
          action: PayloadAction<{
            updatedRectangle: Rectangle;
            pageIdx: number;
          }>
        ) => {
          state.loading = false;
          const { updatedRectangle, pageIdx } = action.payload;
          const components = state.pages[pageIdx].components;
          const component = components.find(
            (item) => item._id == updatedRectangle.component_id
          );
          if (!component) {
            state.error = 'Updating rectangle: cannot find component.';
            return;
          }
          component.rectangle = updatedRectangle;
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
            (item: Component) => item._id == updatedComponent._id
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
      )
      .addCase(
        deletePage.fulfilled,
        (
          state: DesignState,
          action: PayloadAction<{
            shifted: { _id: number; index: number }[];
            indexDeleted: number;
          }>
        ) => {
          const { shifted, indexDeleted } = action.payload;
          state.pages.splice(indexDeleted, 1);
          shifted.forEach(({ _id, index }) => {
            const page = state.pages.find((item) => item._id === _id);
            if (page) {
              page.index = index;
              page.components[0].name = `Page${index}`;
            }
          });
        }
      )
      .addCase(
        addNewPage.fulfilled,
        (
          state: DesignState,
          action: PayloadAction<{
            shifted: { _id: number; index: number }[];
            newPage: Page;
          }>
        ) => {
          const { shifted, newPage } = action.payload;
          state.pages.splice(newPage.index, 0, newPage);
          shifted.forEach(({ _id, index }) => {
            const page = state.pages.find((item) => item._id === _id);
            if (page) {
              page.index = index;
              page.components[0].name = `Page${index}`;
            }
          });
        }
      );
  },
});

export const addNewPageAndUpdateSelectedPageIdx =
  (params: {
    designId: number;
    userImage: string;
    imageHeight: number;
    clientId: string;
  }) =>
  async (dispatch: any, getState: any) => {
    const state = getState();
    const pageIdx = state.app.selectedPageIdx;
    // Destructure params to get necessary values
    const { designId, userImage, imageHeight, clientId } = params;
    // Dispatch the first action and wait for it to complete
    await dispatch(
      addNewPage({
        designId,
        body: {
          pageIdx: pageIdx + 1,
          userImage,
          imageHeight,
          clientId,
        },
      })
    );
    // Dispatch the second action
    dispatch(setSelectedPageIdx(pageIdx + 1));
    dispatch(
      setMessage({ severity: 'success', text: 'added new page successfully' })
    );
  };

export const deletePageAndUpdateSelectedPageIdx =
  (pageId: number) => async (dispatch: any, getState: any) => {
    const state = getState();
    const pageIdx = state.app.selectedPageIdx;
    dispatch(setSelectedPageIdx(Math.max(pageIdx - 1, 0)));

    await dispatch(deletePage(pageId));
    dispatch(
      setMessage({
        severity: 'success',
        text: 'deleted page successfully',
      })
    );
  };

export const { resetDesign, updateRootHeight, updateDesignTitle, setCanEdit } =
  designSliceV3.actions;

export const updateDesignCoverOrTitleAndUpdateState =
  (params: { designId: number; title?: string; imageUrl?: string }) =>
  async (dispatch: any) => {
    const { designId, title, imageUrl } = params;
    await updateDesignCoverOrTitleRequest(designId, { title, imageUrl });
    if (title) dispatch(updateDesignTitle(title));
    dispatch(
      setMessage({
        severity: 'success',
        text: `updated design ${title ? 'title' : 'cover'} successfully`,
      })
    );
  };

export const getDesignDetailsAndSetApp =
  (designId: number, canEdit: any) => async (dispatch: any) => {
    await dispatch(getDesignDetails(designId));
    if (canEdit === false) {
      dispatch(setCanEdit(false));
    }
    dispatch(setSelectedPageIdx(0));
    dispatch(goToPage('DESIGN'));
  };

export default designSliceV3.reducer;
