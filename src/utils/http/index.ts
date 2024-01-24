import type { UpdateDataSrcMethod } from '../../editable/types/options/updateDataSrc';
import type { HTTPRequestFormat, JSONValue } from '../../types';
import { defaultUpdateInit } from './defaults';
import ResponseError from './errors/responseError';
import { ResponseErrors } from './errors/types';
import HTTPResponse from './response';

export default class HTTP {
  private readonly _url: string | URL | RequestInfo;

  public constructor(url: string | URL | RequestInfo) {
    this._url = url;
  }

  public get URL(): string | URL | RequestInfo {
    return this._url;
  }

  public async update<
    B extends Record<PropertyKey, JSONValue>,
    R extends Record<PropertyKey, JSONValue>,
  >(
    body: B,
    init?: RequestInit,
    method: UpdateDataSrcMethod = 'PUT',
    format: HTTPRequestFormat = 'json',
  ): Promise<HTTPResponse<R>> {
    init = defaultUpdateInit(body, init, method, format);

    try {
      const res = await fetch(this.URL, init);
      if (!res.ok) throw new ResponseError(res.status, res.statusText);

      const json = (await res.json()) as R;

      return new HTTPResponse(res.url, res.status, res.statusText, json);
    } catch (err) {
      if (err instanceof SyntaxError) throw new ResponseError(ResponseErrors.PARSE, err.message);

      throw new ResponseError(ResponseErrors.UNKNOWN, (err as Error).message);
    }
  }
}
