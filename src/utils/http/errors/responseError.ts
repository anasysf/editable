import type { ResponseErrors } from './types';

export default class ResponseError extends Error {
  private readonly _code: number | ResponseErrors;
  private readonly _message: string;

  public constructor(code: number | ResponseErrors, message: string) {
    super(message);

    this._code = code;
    this._message = message;
  }

  public get code(): number | ResponseErrors {
    return this._code;
  }

  public get message(): string {
    return this._message;
  }
}
