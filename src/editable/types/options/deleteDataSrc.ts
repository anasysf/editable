import type { HTTPMethod, HTTPRequestFormat } from '../../../types';

export type DeleteDataSrcMethod = Extract<HTTPMethod, 'DELETE' | 'POST'>;

export interface IDeleteDataSrc {
  readonly src: string;
  readonly method?: DeleteDataSrcMethod;
  readonly format?: HTTPRequestFormat;
}

export type DeleteDataSrc = IDeleteDataSrc | string;
