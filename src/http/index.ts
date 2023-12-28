import type { HTTPRequestFormat } from '../editable/types';
import ResponseError from './responseError';

export default class HTTP {
  private readonly _URL: RequestInfo | URL;

  public constructor(url: RequestInfo | URL) {
    this._URL = url;
  }

  private get URL(): RequestInfo | URL {
    return this._URL;
  }

  private formDataFromObj<T extends Record<string, unknown>>(obj?: T): FormData {
    const formData = new FormData();
    for (const key in obj) {
      formData.append(key, String(obj[key]));
    }

    return formData;
  }

  public async send<T extends Record<string, unknown>>(
    init: RequestInit,
    format: HTTPRequestFormat = 'json',
    body?: T,
  ): Promise<T> {
    init = {
      ...init,
      headers: {
        'Content-Type': format === 'json' ? 'application/json' : 'multipart/form-data',
      },
      body:
        format === 'json' && body !== undefined
          ? JSON.stringify(body)
          : this.formDataFromObj(body),
    };

    const res = await fetch(this.URL, init);
    if (!res.ok) throw new ResponseError(res.status, res.statusText, res.url);

    return (await res.json()) as T;
  }
}
