import type { JSONValue } from '../../types';

export default class HTTPResponse<R extends Record<PropertyKey, JSONValue>> {
  private readonly _url: string;

  private readonly _status: number;

  private readonly _statusText: string;

  private readonly _data: R;

  public constructor(url: string, status: number, statusText: string, data: R) {
    this._url = url;
    this._status = status;
    this._statusText = statusText;
    this._data = data;
  }

  public get URL(): string {
    return this._url;
  }

  public get status(): number {
    return this._status;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public get data(): R {
    return this._data;
  }
}
