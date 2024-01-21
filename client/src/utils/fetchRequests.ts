import { Component, Design, HtmlTag, Rectangle } from '../../../docs/types';

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
      const rectangle = data.components[0].rectangle;
      data.components[0].rectangle = {
        ...rectangle,
        width: parseFloat(rectangle.width),
        height: parseFloat(rectangle.height),
        x_position: parseFloat(rectangle.x_position),
        y_position: parseFloat(rectangle.y_position),
      };
      return data;
    })
    .catch((err) => {
      console.log('App: add design: ERROR: ', err);
      throw err;
    });
}

export function updateDesignRequest(
  designId: number,
  body: {
    userImage: string;
    imageToDelete?: string;
    imageHeight?: number;
    title?: string;
    rootId?: number;
  }
): Promise<Design> {
  return fetch(`/designs/update/${designId}`, {
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
      data.components.forEach((component: any) => {
        const rectangle = component.rectangle;
        component.rectangle = {
          ...rectangle,
          width: parseFloat(rectangle.width),
          height: parseFloat(rectangle.height),
          x_position: parseFloat(rectangle.x_position),
          y_position: parseFloat(rectangle.y_position),
        };
      });
      return data;
    })
    .catch((err) => {
      throw err;
    });
}

export function addNewComponentRequest(
  designId: number,
  body: { index: number; rootId: number; name: string }
): Promise<Component> {
  return fetch(`/designs/new-component/${designId}`, {
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
      const rectangle = data.rectangle;
      data.rectangle = {
        ...rectangle,
        width: parseFloat(rectangle.width),
        height: parseFloat(rectangle.height),
        x_position: parseFloat(rectangle.x_position),
        y_position: parseFloat(rectangle.y_position),
      };
      return data;
    })
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
    .then((data) => {
      data.components.forEach((component: any) => {
        const rectangle = component.rectangle;
        component.rectangle = {
          ...rectangle,
          width: parseFloat(rectangle.width),
          height: parseFloat(rectangle.height),
          x_position: parseFloat(rectangle.x_position),
          y_position: parseFloat(rectangle.y_position),
        };
      });
      return data;
    })
    .catch((err) => {
      throw err;
    });
}

export function deleteDesign(
  designId: number
): Promise<'deleted design successfully'> {
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
  body: { parentId: number }
): Promise<{ componentId: number; parentId: number }> {
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
  }
): Promise<Component> {
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
  }
): Promise<Rectangle> {
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
    .then((data): Rectangle => {
      return {
        ...data,
        width: parseFloat(data.width),
        height: parseFloat(data.height),
        x_position: parseFloat(data.x_position),
        y_position: parseFloat(data.y_position),
      };
    })
    .catch((err) => {
      throw err;
    });
}

export function updateComponentRectangleStyleRequest(
  componentId: number,
  body: {
    styleToChange:
      | 'stroke'
      | 'backgroundColor'
      | 'borderWidth'
      | 'borderRadius';
    value: string | number;
  }
): Promise<Rectangle> {
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
    .then((data): Rectangle => {
      return {
        ...data,
        width: parseFloat(data.width),
        height: parseFloat(data.height),
        x_position: parseFloat(data.x_position),
        y_position: parseFloat(data.y_position),
      };
    })
    .catch((err) => {
      throw err;
    });
}
