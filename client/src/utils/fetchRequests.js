export function addDesignRequest(body) {
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

export function updateDesignRequest(designId, body) {
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

export function addDesign() {
  return;
}

export function addNewComponentRequest(designId, body) {
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

export function getDesignDetailsRequest(designId) {
  return fetch(`/designs/details/${designId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: get components: ERROR', err));
}

export function deleteDesign(designId) {
  return fetch(`/designs/delete/${designId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: delete design: ERROR', err));
}

export function deleteComponentRequest(componentId) {
  return fetch(`/components/delete/${componentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('App: delete design: ERROR', err));
}

export function updateComponentParentRequest(componentId, body) {
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

export function updateComponentHtmlTagRequest(componentId, body) {
  console.log(componentId, body);
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

export function submitComponentFormRequest(componentId, body) {
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

export function updateProfilePictureRequest(body) {
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
