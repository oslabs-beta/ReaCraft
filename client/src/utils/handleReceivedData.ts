import {
  Design,
  HtmlTag,
  Rectangle,
  Component,
  Page,
} from '../../../docs/types';
import { convertObjToArr } from './convertBetweenObjArr';

export type RectangleRes = {
  component_id: number;
  x_position: string;
  y_position: string;
  z_index: number;
  width: string;
  height: string;
  borderwidth: number;
  borderradius?: string;
  backgroundcolor?: string;
  stroke: string;
};

export function handleRectangleRes(data: RectangleRes): Rectangle {
  return {
    ...data,
    borderradius: Number(data.borderradius),
    width: parseFloat(data.width),
    height: parseFloat(data.height),
    x_position: parseFloat(data.x_position),
    y_position: parseFloat(data.y_position),
  };
}

export type ComponentRes = {
  _id: number;
  page_id: number;
  parent_id: number;
  index: number;
  name: string;
  html_tag: HtmlTag;
  inner_html: string;
  props: string;
  styles: string;
  rectangle?: RectangleRes;
};

export function handleComponentRes(data: ComponentRes): Component {
  const { props, styles, rectangle } = data;
  const dataToReturn: any = { ...data };
  if (rectangle) {
    dataToReturn.rectangle = handleRectangleRes(rectangle);
  }
  return {
    ...dataToReturn,
    props: convertObjToArr(JSON.parse(props)),
    styles: convertObjToArr(JSON.parse(styles)),
  };
}

export type PageRes = {
  _id: number;
  design_id: number;
  index: number;
  image_url: string;
  components?: ComponentRes[];
};

export function handlePageRes(data: PageRes): Page {
  const newData: any = { ...data };
  if (newData.components) {
    newData.components = newData.components.map((componentRes: ComponentRes) =>
      handleComponentRes(componentRes)
    );
  }
  return newData;
}

export type DesignRes = {
  _id: number;
  user_id: number;
  title: string;
  created_at: string;
  last_updated: string;
  image_url: string;
  pages?: PageRes[];
};

export function handleDesignRes(data: DesignRes): Design {
  const newData: any = { ...data };
  if (newData.pages) {
    newData.pages = newData.pages.map((PageRes: PageRes) =>
      handlePageRes(PageRes)
    );
  }
  console.log('handling, ', newData);
  return newData;
}
