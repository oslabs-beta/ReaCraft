import { HtmlTag } from '../../../docs/types';

export function addDesignRequest(body: {
  userImage: string;
  imageWidth: number;
  imageHeight: number;
}) {
  return fetch('/designs/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: add design: ERROR: ', err));
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
) {
  return fetch(`/designs/update/${designId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: update design: ERROR: ', err));
}

export function addNewComponentRequest(
  designId: number,
  body: { index: number; rootId: number; name: string }
) {
  return fetch(`/designs/new-component/${designId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: add new component: ERROR: ', err));
}

export function getDesigns() {
  return fetch('/designs/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: get designs: ERROR', err));
}

export function getDesignDetailsRequest(designId: number) {
  return fetch(`/designs/details/${designId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: get components: ERROR', err));
}

export function deleteDesign(designId: number) {
  return fetch(`/designs/delete/${designId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: delete design: ERROR', err));
}

export function deleteComponentRequest(componentId: number) {
  return fetch(`/components/delete/${componentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: delete design: ERROR', err));
}

export function updateComponentParentRequest(
  componentId: number,
  body: { parentId: number }
) {
  return fetch(`/components/update-parent/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: add new component: ERROR: ', err));
}

export function updateComponentHtmlTagRequest(
  componentId: number,
  body: { htmlTag: HtmlTag }
) {
  return fetch(`/components/update-tag/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: add new component: ERROR: ', err));
}

export function submitComponentFormRequest(
  componentId: number,
  body: {
    name: string;
    innerHtml: string;
    styles: { [key: string]: any };
    props: { [key: string]: any };
  }
) {
  return fetch(`/components/submit/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: add new component: ERROR: ', err));
}

export function updateProfilePictureRequest(body: {
  userImage: string;
  imageToDelete?: string;
}) {
  return fetch(`/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: update profile picture: ERROR: ', err));
}

export function updateComponentRectanglePositionRequest(
  componentId: number,
  body: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  return fetch(`/components/update-position/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Server responded with an error');
      }
      console.log('returning from fetch request');
      return res.json();
    })
    .catch((err) =>
      console.log('App: update rectangle position(size): ERROR: ', err)
    );
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
) {
  return fetch(`/components/update-rectangle-style/${componentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Server responded with an error');
      }
      console.log('returning from fetch request');
      return res.json();
    })
    .catch((err) => console.log('App: update rectangle style: ERROR: ', err));
}
