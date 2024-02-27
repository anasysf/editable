import type { DeleteDataSrcMethod } from '../../editable/types/options/deleteDataSrc';
import type { PostDataSrcMethod } from '../../editable/types/options/postDataSrc';
import type { UpdateDataSrcMethod } from '../../editable/types/options/updateDataSrc';
import type { HttpRequestFormat, JsonValue } from '../../types';
import { defaultDeleteInit, defaultPostInit, defaultUpdateInit } from './defaults';
import ResponseError from './errors/responseError';
import { ResponseErrors } from './errors/types';
import HttpResponse from './response';

export default class Http {
  public constructor(private readonly url: string | URL | RequestInfo) {}

  public async post<
    B extends Record<PropertyKey, JsonValue>,
    R extends Record<PropertyKey, JsonValue>,
  >(
    body: B,
    init?: RequestInit,
    method: PostDataSrcMethod = 'POST',
    format: HttpRequestFormat = 'json',
  ): Promise<HttpResponse<R>> {
    init = defaultPostInit(body, init, method, format);

    try {
      const res = await fetch(this.url, init);
      if (!res.ok) throw new ResponseError(res.status, res.statusText);

      const json = (await res.json()) as R;

      return new HttpResponse(res.url, res.status, res.statusText, json);
    } catch (err) {
      if (err instanceof SyntaxError) throw new ResponseError(ResponseErrors.PARSE, err.message);

      throw new ResponseError(ResponseErrors.UNKNOWN, (err as Error).message);
    }
  }

  public async update<
    B extends Record<PropertyKey, JsonValue>,
    R extends Record<PropertyKey, JsonValue>,
  >(
    body: B,
    init?: RequestInit,
    method: UpdateDataSrcMethod = 'PUT',
    format: HttpRequestFormat = 'json',
  ): Promise<HttpResponse<R>> {
    init = defaultUpdateInit(body, init, method, format);

    try {
      const res = await fetch(this.url, init);
      if (!res.ok) throw new ResponseError(res.status, res.statusText);

      const json = (await res.json()) as R;

      return new HttpResponse(res.url, res.status, res.statusText, json);
    } catch (err) {
      if (err instanceof SyntaxError) throw new ResponseError(ResponseErrors.PARSE, err.message);

      throw new ResponseError(ResponseErrors.UNKNOWN, (err as Error).message);
    }
  }

  public async delete<
    B extends Record<PropertyKey, JsonValue>,
    R extends Record<PropertyKey, JsonValue>,
  >(
    body: B,
    init?: RequestInit,
    method: DeleteDataSrcMethod = 'DELETE',
    format: HttpRequestFormat = 'json',
  ): Promise<HttpResponse<R>> {
    init = defaultDeleteInit(body, init, method, format);

    try {
      const res = await fetch(this.url, init);
      if (!res.ok) throw new ResponseError(res.status, res.statusText);

      const json = (await res.json()) as R;

      return new HttpResponse(res.url, res.status, res.statusText, json);
    } catch (err) {
      if (err instanceof SyntaxError) throw new ResponseError(ResponseErrors.PARSE, err.message);

      throw new ResponseError(ResponseErrors.UNKNOWN, (err as Error).message);
    }
  }
}
