export default class ResponseError extends Error {
  private readonly _status: number;
  private readonly _statusText: string;
  private readonly _url: string;

  public constructor(status: number, statusText: string, url: string) {
    super(statusText);

    this._status = status;
    this._statusText = statusText;
    this._url = url;
  }

  public get status(): number {
    return this._status;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public get url(): string {
    return this._url;
  }
}
