import type { DeleteDataSrcMethod } from '../../editable/types/options/deleteDataSrc';
import type { UpdateDataSrcMethod } from '../../editable/types/options/updateDataSrc';
import type { HTTPRequestFormat, JSONValue } from '../../types';

function buildFormData<B extends Record<PropertyKey, JSONValue>>(body: B): FormData {
  return Object.keys(body).reduce((formData, key) => {
    formData.append(key, String(body[key]));
    return formData;
  }, new FormData());
}

function defaultBody<B extends Record<PropertyKey, JSONValue>>(
  body: B,
  format: HTTPRequestFormat = 'json',
): BodyInit {
  return format === 'json' ? JSON.stringify(body) : buildFormData(body);
}

export function defaultUpdateInit<B extends Record<PropertyKey, JSONValue>>(
  body: B,
  init?: RequestInit,
  method: UpdateDataSrcMethod = 'PUT',
  format: HTTPRequestFormat = 'json',
): RequestInit {
  return {
    method,
    body: defaultBody(body, format),
    headers: {
      'Content-Type': format === 'json' ? 'application/json' : 'application/form-data',
    },
    ...init,
  };
}

export function defaultDeleteInit<B extends Record<PropertyKey, JSONValue>>(
  body: B,
  init?: RequestInit,
  method: DeleteDataSrcMethod = 'DELETE',
  format: HTTPRequestFormat = 'json',
): RequestInit {
  return {
    method,
    body: defaultBody(body, format),
    headers: {
      'Content-Type': format === 'json' ? 'application/json' : 'application/form-data',
    },
    ...init,
  };
}
