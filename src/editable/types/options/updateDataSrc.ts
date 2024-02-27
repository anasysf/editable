import type { HttpMethod, HttpRequestFormat } from '../../../types';

export type UpdateDataSrcMethod = Extract<HttpMethod, 'PUT' | 'PATCH' | 'POST'>;

export type UpdateDataSrcObj = {
  readonly src: string;
  readonly method?: UpdateDataSrcMethod;
  readonly format?: HttpRequestFormat;
  readonly prop?: string;
};

export type UpdateDataSrc = UpdateDataSrcObj | string;
