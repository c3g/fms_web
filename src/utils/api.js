import fetch from "cross-fetch";
import { stringify as qs } from "querystring";

import {API_BASE_PATH} from "../config";


const api = {
  auth: {
    token: credentials => post("/token/", credentials),
    tokenRefresh: tokens => post("/token/refresh/", tokens),
  },

  containerKinds: {
    list: () => get("/container-kinds/"),
  },

  containers: {
    get: barcode => get(`/containers/${barcode}`),
    list: () => get("/containers/"),
  },

  individuals: {
    get: individualId => get(`/individuals/${individualId}`),
    list: (page = {}) => get("/individuals/", page),
  },

  samples: {
    get: sampleId => get(`/samples/${sampleId}`),
    list: (page = {}) => get("/samples/", page),
    listVersions: sampleId => get(`/samples/${sampleId}/versions`),
  },

  users: {
    list: () => get("/users/"),
    listVersions: userId => get(`/versions?revision__user=${userId}`),
  },
}


export default api;


function apiFetch(method, route, body) {
  return (_, getState) => {

    const accessToken = getState().auth.tokens.access;

    return fetch(`${API_BASE_PATH}${route}`, {
      method,
      headers: {
          "content-type": "application/json",
          "authorization": accessToken ? `Bearer ${accessToken}` : undefined,
      },
      body: body === undefined ? body : JSON.stringify(body),
    })
    .then(attachJSON)
    .then(response => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(createAPIError(response));
    })
  };
};

function get(route, queryParams) {
  return apiFetch('GET', route + (queryParams ? '?' + qs(queryParams) : ''), undefined);
}

function post(route, body) {
  return apiFetch('POST', route, body);
}


function createAPIError(response) {
  const data = response.data

  let detail
  try {
    detail = data.detail ||
      (data.revision__user && ('User: ' + data.revision__user.join(', ')))
  } catch (_) {}

  const message = detail ?
    ('API error: ' + detail) :
    (`HTTP error ${response.status}: ` + response.statusText + ': ' + response.url)

  const error = new Error(message);
  error.fromAPI = Boolean(detail);
  error.url = response.url;
  error.status = response.status;
  error.statusText = response.statusText;
  error.stack = []

  return error;
}

function attachJSON(response) {
  return response.json()
  .then(data => {
    response.data = data;
    return response;
  })
  .catch(err => {
    response.data = {};
    return response;
  })
}
