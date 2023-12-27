/**
 * The HTTP Methods supported.
 * @internal
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * The Values accepted by JSON.
 * @internal
 */
export type JSONValues =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null;
