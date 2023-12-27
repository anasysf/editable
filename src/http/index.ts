import type { HTTPRequestFormat } from '../editable/types';

export default class HTTP {
  private readonly _URL: RequestInfo | URL;

  public constructor(url: RequestInfo | URL) {
    this._URL = url;
  }

  private get URL(): RequestInfo | URL {
    return this._URL;
  }

  private formDataFromObj<TBody extends Record<string, unknown> = Record<string, never>>(
    obj: TBody,
  ): FormData {
    const formData = new FormData();
    for (const key in obj) {
      formData.append(key, String(obj[key]));
    }

    return formData;
  }

  public async put<TBody extends Record<string, unknown> = Record<string, never>>(
    body: TBody,
    init: RequestInit,
    format: HTTPRequestFormat = 'json',
  ): Promise<void> {
    init = {
      ...init,
      headers: {
        'Content-Type': format === 'json' ? 'application/json' : 'multipart/form-data',
      },
      body: format === 'json' ? JSON.stringify(body) : this.formDataFromObj(body),
    };

    const res = await fetch(this.URL, init);
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  }
}
