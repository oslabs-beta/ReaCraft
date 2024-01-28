import {
  Component,
  Design,
  HtmlTag,
  Page,
  Rectangle,
} from '../../../docs/types';
import {
  DesignRes,
  handleComponentRes,
  handleDesignRes,
  handlePageRes,
  handleRectangleRes,
} from './handleReceivedData';

export function addDesignRequest(body: {
  userImage: string;
  imageHeight: number;
}): Promise<Design> {
  return fetch('/designs/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      console.log('new design', data);
      return data;
    })
    .then(handleDesignRes)
    .catch((err) => {
      console.log('App: add design: ERROR: ', err);
      throw err;
    });
}

export function addNewComponentRequest(
  pageId: number,
  body: { index: number; rootId: number; name: string }
): Promise<Component> {
  return fetch(`/pages/new-component/${pageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(handleComponentRes)
    .catch((err) => {
      throw err;
    });
}

export function getDesigns(): Promise<Design[]> {
  return fetch('/designs/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data: DesignRes[]): Design[] => {
      const newData = data.map((designRes: DesignRes) => {
        const { created_at, last_updated } = designRes;
        const design: any = { ...designRes };
        design.created_at = new Date(
          new Date(created_at).toString().split('-')[0]
        );
        design.last_updated = new Date(
          new Date(last_updated).toString().split('-')[0]
        );
        return design;
      });
      return newData;
    })
    .catch((err) => {
      throw err;
    });
}

export function getDesignDetailsRequest(designId: number): Promise<Design> {
  return fetch(`/designs/details/${designId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(handleDesignRes)
    .catch((err) => {
      throw err;
    });
}

export function deleteDesign(
  designId: number
): Promise<{ design: 'deleted design successfully' }> {
  return fetch(`/designs/delete/${designId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function deleteComponentRequest(componentId: number): Promise<{
  shifted: Array<{ _id: number; index: number }>;
  indexDeleted: number;
  pageId: number;
}> {
  return fetch(`/components/delete/${componentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function updateComponentParentRequest(
  componentId: number,
  body: { parentId: number; pageIdx: number }
): Promise<{
  componentId: number;
  parentId: number;
  parentName: string;
  pageIdx: number;
}> {
  return fetch(`/components/update-parent/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function updateComponentHtmlTagRequest(
  componentId: number,
  body: { htmlTag: HtmlTag }
): Promise<{ componentName: string; htmlTag: HtmlTag }> {
  return fetch(`/components/update-tag/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function submitComponentFormRequest(
  componentId: number,
  body: {
    name: string;
    innerHtml: string;
    styles: { [key: string]: any };
    props: { [key: string]: any };
    pageIdx: number;
    htmlTag: HtmlTag;
  }
): Promise<{ updatedComponent: Component; pageIdx: number }> {
  return fetch(`/components/submit/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(({ updatedComponent, pageIdx }) => {
      return {
        updatedComponent: handleComponentRes(updatedComponent),
        pageIdx: Number(pageIdx),
      };
    })
    .catch((err) => {
      throw err;
    });
}

export function updateProfilePictureRequest(body: {
  userImage: string;
  imageToDelete?: string;
}): Promise<{ imageUrl: string }> {
  return fetch(`/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function updateComponentRectanglePositionRequest(
  componentId: number,
  body: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageIdx: number;
  }
): Promise<{ updatedRectangle: Rectangle; pageIdx: number }> {
  return fetch(`/components/update-position/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(({ updatedRectangle, pageIdx }) => ({
      updatedRectangle: handleRectangleRes(updatedRectangle),
      pageIdx: Number(pageIdx),
    }))
    .catch((err) => {
      throw err;
    });
}

export function updateComponentRectangleStyleRequest(
  componentId: number,
  body: {
    styleToChange:
      | 'stroke'
      | 'background_color'
      | 'border_width'
      | 'border_radius';
    pageIdx: number;
    value: string | number;
  }
): Promise<{ updatedRectangle: Rectangle; pageIdx: number }> {
  return fetch(`/components/update-rectangle-style/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(({ updatedRectangle, pageIdx }) => ({
      updatedRectangle: handleRectangleRes(updatedRectangle),
      pageIdx: Number(pageIdx),
    }))
    .catch((err) => {
      throw err;
    });
}

export function downloadProject(body: {
  pagesData: { [key: string]: { filename: string; content: string }[] };
  appData: { filename: string; content: string };
  title: string;
}) {
  return fetch('/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.blob();
    })
    .catch((err) => {
      throw err;
    });
}

export function deletePageRequest(pageId: number): Promise<{
  shifted: { _id: number; index: number }[];
  indexDeleted: number;
}> {
  return fetch(`/pages/delete/${pageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}

export function addNewPageRequest(
  designId: number,
  body: {
    pageIdx: number;
    userImage: string;
    imageHeight: number;
  }
): Promise<{
  newPage: Page;
  shifted: {
    _id: number;
    index: number;
  }[];
}> {
  return fetch(`/designs/new-page/${designId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(({ newPage, shifted }) => ({
      newPage: handlePageRes(newPage),
      shifted,
    }))
    .catch((err) => {
      throw err;
    });
}

export function updateDesignCoverOrTitleRequest(
  designId: number,
  body: {
    imageUrl?: string;
    title?: string;
  }
): Promise<{ message: 'updated design successfully' }> {
  return fetch(`designs/update/${designId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
}
