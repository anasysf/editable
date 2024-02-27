import type { DeleteDataSrcMethod } from '../../editable/types/options/deleteDataSrc';
import type { PostDataSrcMethod } from '../../editable/types/options/postDataSrc';
import type { UpdateDataSrcMethod } from '../../editable/types/options/updateDataSrc';
import type { HttpRequestFormat, JsonValue } from '../../types';

function buildFormData<B extends Record<PropertyKey, JsonValue>>(body: B): FormData {
  return Object.keys(body).reduce((formData, key) => {
    formData.append(key, String(body[key]));
    return formData;
  }, new FormData());
}

function defaultBody<B extends Record<PropertyKey, JsonValue>>(
  body: B,
  format: HttpRequestFormat = 'json',
): BodyInit {
  return format === 'json' ? JSON.stringify(body) : buildFormData(body);
}

export function defaultPostInit<B extends Record<PropertyKey, JsonValue>>(
  body: B,
  init?: RequestInit,
  method: PostDataSrcMethod = 'POST',
  format: HttpRequestFormat = 'json',
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

export function defaultUpdateInit<B extends Record<PropertyKey, JsonValue>>(
  body: B,
  init?: RequestInit,
  method: UpdateDataSrcMethod = 'PUT',
  format: HttpRequestFormat = 'json',
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

export function defaultDeleteInit<B extends Record<PropertyKey, JsonValue>>(
  body: B,
  init?: RequestInit,
  method: DeleteDataSrcMethod = 'DELETE',
  format: HttpRequestFormat = 'json',
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
