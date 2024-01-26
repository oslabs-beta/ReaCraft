export type Rectangle = {
  component_id: number;
  x_position: number;
  y_position: number;
  z_index: number;
  width: number;
  height: number;
  border_width: number;
  border_radius?: number;
  background_color?: string;
  stroke: string;
};

export type HtmlTag = '<div>' | '<p>' | '<button>';

export type Component = {
  _id: number;
  page_id: number;
  parent_id: number;
  index: number;
  name: string;
  html_tag: HtmlTag;
  inner_html: string;
  props: { key: string; value: string }[];
  styles: { key: string; value: string }[];
  rectangle?: Rectangle;
};

export type Page = {
  _id: number;
  design_id: number;
  index: number;
  image_url: string;
  components: Component[];
};

export type Design = {
  _id: number;
  user_id: number;
  title: string;
  image_url: string;
  created_at: Date;
  last_updated: Date;
  pages?: Page[];
};

export type DefaultError = {
  log: string;
  status?: number;
  message: {
    err: string;
  };
};
