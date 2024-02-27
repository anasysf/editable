import type { HttpMethod, HttpRequestFormat } from '../../../types';

export type DeleteDataSrcMethod = Extract<HttpMethod, 'DELETE' | 'POST'>;

export type DeleteDataSrcObj = {
  readonly src: string;
  readonly method?: DeleteDataSrcMethod;
  readonly format?: HttpRequestFormat;
};

export type DeleteDataSrc = DeleteDataSrcObj | string;
