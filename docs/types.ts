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

export type RectangleQueryRes = {
  rows: Rectangle[];
};

export type HtmlTag = '<div>' | '<p>' | '<button>';

interface ComponentEssential {
  _id: number;
  page_id: number;
  parent_id: number;
  index: number;
  name: string;
  html_tag: HtmlTag;
  inner_html: string;
}

export interface Component extends ComponentEssential {
  props: { key: string; value: string }[];
  styles: { key: string; value: string }[];
  rectangle?: Rectangle;
}

export interface ComponentRow extends ComponentEssential {
  props: { [key: string]: string };
  styles: { [key: string]: string };
}

export type ComponentQueryRes = { rows: ComponentRow[] };

export interface PageRow {
  _id: number;
  design_id: number;
  index: number;
  image_url: string;
}

export type PageQueryRes = { rows: PageRow[] };

export interface Page extends PageRow {
  components: Component[];
}

export interface DesignRow {
  _id: number;
  user_id: number;
  title: string;
  image_url: string;
  created_at: Date;
  last_updated: Date;
  last_updated_by: string;
}

export type DesignQueryRes = {
  rows: DesignRow[];
};

export interface Design extends DesignRow {
  pages?: Page[];
  canEdit?: Boolean;
}

export type CollaboratorRow = {
  design_id: number;
  collaborator_id: number;
  can_edit: boolean;
  is_owner: boolean;
};

export type CollaboratorQueryRes = {
  rows: CollaboratorRow[];
};

export type DefaultError = {
  log: string;
  status?: number;
  message: {
    err: string;
  };
};
