export type Rectangle = {
  component_id: number;
  x_position: number;
  y_position: number;
  z_index: number;
  width: number;
  height: number;
  isresizable?: boolean;
  borderwidth: number;
  borderradius?: number;
  backgroundcolor?: string;
  stroke: string;
};

export type HtmlTag = '<div>' | '<p>' | '<button>';

export type Component = {
  _id: number;
  design_id: number;
  index: number;
  name: string;
  html_tag: HtmlTag;
  inner_html: string;
  props: [key: string, value: string] | { [key: string]: any };
  styles: [key: string, value: string] | { [key: string]: any };
  created_at: string;
  rectangle?: Rectangle;
};

export type Design = {
  _id: number;
  user_id: number;
  title: string;
  created_at: string;
  last_updated: string;
  image_url: string;
  components?: Component[];
};

export type DefaultError = {
  log: string;
  status?: number;
  message: {
    err: string;
  };
};
