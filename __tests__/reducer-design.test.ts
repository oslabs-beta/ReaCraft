import { configureStore } from '@reduxjs/toolkit';
import designSliceV3, {
  DesignState,
  addNewComponent,
  getDesignDetails,
  getDesignDetailsAndSetApp,
  newDesign,
  updateDesignCoverOrTitleAndUpdateState,
} from '../client/src/utils/reducers/designSliceV3';
import { Component } from 'react';
import {
  ComponentRes,
  DesignRes,
  PageRes,
  RectangleRes,
  handleDesignRes,
  handlePageRes,
} from '../client/src/utils/handleReceivedData';
import appSlice, {
  initialAppState,
} from '../client/src/utils/reducers/appSlice';

const mockRectangle: RectangleRes = {
  component_id: 0,
  x_position: '0',
  y_position: '0',
  z_index: 0,
  width: '100',
  height: '100',
  border_width: 10,
  border_radius: '20',
  background_color: 'white',
  stroke: 'red',
};

const mockPage0Root: ComponentRes = {
  _id: 0,
  page_id: 0,
  parent_id: null,
  index: 0,
  name: 'Page0',
  html_tag: '<div>',
  inner_html: '',
  rectangle: mockRectangle,
  props: JSON.stringify({ prop: 'test' }),
  styles: JSON.stringify({ style: 'test' }),
};

const mockPage0: PageRes = {
  _id: 0,
  design_id: 0,
  index: 0,
  image_url: 'test image',
  components: [mockPage0Root],
};

const mockDesign: DesignRes = {
  _id: 0,
  user_id: 0,
  title: 'Test Design',
  image_url: 'test cover',
  created_at: 'now',
  last_updated: 'now',
  last_updated_by: 'testUser',
  pages: [mockPage0],
};

const mockDesignState: DesignState = {
  ...handleDesignRes(mockDesign),
  pages: [handlePageRes(mockPage0)],
  loading: false,
  error: undefined,
  canEdit: true,
};

describe('designSlice', () => {
  let store: any;

  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Enter Workspace: create new design and get design details', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: { design: designSliceV3 },
      });
    });

    it('handles successful design creation', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDesign),
        })
      );

      await store.dispatch(
        newDesign({
          userImage: 'test image',
          imageHeight: 100,
          clientId: 'test client id',
        })
      );

      const { design } = store.getState();
      expect(design).toEqual(mockDesignState);
    });

    it('handles successful design details get', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDesign),
        })
      );

      await store.dispatch(getDesignDetails(0));

      const { design } = store.getState();
      expect(design).toEqual(mockDesignState);
    });

    it('handles successful design details get and set app', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDesign),
        })
      );

      await store.dispatch(getDesignDetailsAndSetApp(0, false));

      const { design } = store.getState();
      expect(design).toEqual({ ...mockDesignState, canEdit: false });
    });
  });

  describe('Inside Workspace: update design, page, component or rectangle', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          design: designSliceV3,
          app: appSlice,
        },
        preloadedState: {
          design: mockDesignState,
          app: initialAppState,
        },
      });
    });

    it('handles successful design title update', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ message: 'updated design successfully' }),
        })
      );

      await store.dispatch(
        updateDesignCoverOrTitleAndUpdateState({
          designId: 0,
          title: 'new title',
        })
      );

      const { design, app } = store.getState();
      expect(design).toEqual({
        ...mockDesignState,
        title: 'new title',
      });
      expect(app.message).toEqual({
        severity: 'success',
        text: 'updated design title successfully',
      });
    });

    it('handles successful design cover update', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ message: 'updated design successfully' }),
        })
      );

      await store.dispatch(
        updateDesignCoverOrTitleAndUpdateState({
          designId: 0,
          imageUrl: 'test cover',
        })
      );

      const { design, app } = store.getState();
      expect(design).toEqual(mockDesignState);
      expect(app.message).toEqual({
        severity: 'success',
        text: 'updated design cover successfully',
      });
    });

    it('handles successful adding new component', async () => {
      const mockNewComponent: ComponentRes = {
        _id: 1,
        page_id: 0,
        parent_id: 0,
        index: 1,
        name: 'NewComponent',
        html_tag: '<div>',
        inner_html: 'new component',
        rectangle: {
          component_id: 1,
          x_position: '0',
          y_position: '0',
          z_index: 0,
          width: '100',
          height: '100',
          border_width: 10,
          border_radius: '20',
          background_color: 'white',
          stroke: 'red',
        },
        props: JSON.stringify({ prop: 'test' }),
        styles: JSON.stringify({ style: 'test' }),
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNewComponent),
        })
      );

      await store.dispatch(
        addNewComponent({
          pageId: 0,
          body: {
            index: 1,
            rootId: 0,
            name: 'NewComponent',
          },
        })
      );

      const { design } = store.getState();
      expect(design).toEqual({
        ...mockDesignState,
        pages: [
          handlePageRes({
            ...mockPage0,
            components: [mockPage0Root, mockNewComponent],
          }),
        ],
      });
    });
  });
});
