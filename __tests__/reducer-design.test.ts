import { configureStore } from '@reduxjs/toolkit';
import designSliceV3, {
  DesignState,
  newDesign,
  updateDesignCoverOrTitleAndUpdateState,
} from '../client/src/utils/reducers/designSliceV3';
import {} from 'react';
import {
  ComponentRes,
  DesignRes,
  PageRes,
  RectangleRes,
  handleDesignRes,
} from '../client/src/utils/handleReceivedData';
import appSlice from '../client/src/utils/reducers/appSlice';

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
  image_url: 'https://reacraft.s3.amazonaws.com/test.png',
  components: [mockPage0Root],
};

const mockDesign: DesignRes = {
  _id: 0,
  user_id: 0,
  title: 'Test Design',
  image_url: 'https://reacraft.s3.amazonaws.com/test.png',
  created_at: 'now',
  last_updated: 'now',
  last_updated_by: 'testUser',
  pages: [mockPage0],
  canEdit: true,
};

describe('designSlice', () => {
  let store: any;

  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;

    store = configureStore({
      reducer: {
        design: designSliceV3,
        app: appSlice,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    expect(design).toEqual({
      ...handleDesignRes(mockDesign),
      loading: false,
      error: undefined,
    });
  });

  it('handles successful design title or cover update', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDesign),
      })
    );

    await store.dispatch(
      updateDesignCoverOrTitleAndUpdateState({
        designId: 0,
        title: 'new title',
      })
    );

    const { design, app } = store.getState();
    expect(design.title).toBe('new title');
    expect(app.message).toEqual({
      severity: 'success',
      text: 'updated design title successfully',
    });
  });
});
