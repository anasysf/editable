import type { HttpMethod, HttpRequestFormat, JsonValue } from '../../../types';

/** The dataSrc property HTTP Method. */
export type DataSrcMethod = Extract<HttpMethod, 'GET' | 'POST'>;

export type DataSrcObj = {
  /** The endpoint to send the request to. */
  readonly src: string;
  /** The method used, 'GET' | 'POST'. */
  readonly method?: DataSrcMethod;
  /** The prop to get the data from. */
  readonly prop?: string;
};

export type DataSrcGet = DataSrcObj & {
  readonly method: 'GET';
};

export type DataSrcPost = DataSrcObj & {
  readonly method: 'POST';
  /** The data sent with the request. */
  readonly data?: Record<PropertyKey, JsonValue>;
  /** The format used to send the request 'json' or 'form-data'. */
  readonly format?: HttpRequestFormat;
};

/**
 * The dataSrc property type.
 * @typeParam T - The HTTP Method 'GET' or 'POST'.
 */
export type DataSrc<T extends DataSrcMethod> =
  | (T extends 'GET' ? DataSrcGet : DataSrcPost)
  | string;
