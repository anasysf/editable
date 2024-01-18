import type { HTTPMethod, HTTPRequestFormat, JSONValue } from '../../../types';

/** The dataSrc property HTTP Method. */
export type DataSrcMethod = Extract<HTTPMethod, 'GET' | 'POST'>;

export interface IDataSrcBASE {
  /** The endpoint to send the request to. */
  readonly src: string;
  /** The method used, 'GET' | 'POST'. */
  readonly method?: DataSrcMethod;
  /** The prop to get the data from. */
  readonly prop?: string;
}

export type IDataSrcGET = IDataSrcBASE & {
  readonly method: 'GET';
};

export type IDataSrcPOST = IDataSrcBASE & {
  readonly method: 'POST';
  /** The data sent with the request. */
  readonly data?: Record<PropertyKey, JSONValue>;
  /** The format used to send the request 'json' or 'form-data'. */
  readonly format?: HTTPRequestFormat;
};

/**
 * The dataSrc property type.
 * @typeParam T - The HTTP Method 'GET' or 'POST'.
 */
export type DataSrc<T extends DataSrcMethod> =
  | (T extends 'GET' ? IDataSrcGET : IDataSrcPOST)
  | string;
