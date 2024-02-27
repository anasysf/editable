import type { JsonValue } from '../../types';

export default class HttpResponse<R extends Record<PropertyKey, JsonValue>> {
  public constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly data: R,
  ) {}
}
