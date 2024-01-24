import type { HTTPMethod, HTTPRequestFormat } from '../../../types';

export type UpdateDataSrcMethod = Extract<HTTPMethod, 'PUT' | 'PATCH' | 'POST'>;

export interface IUpdateDataSrc {
  readonly src: string;
  readonly method?: UpdateDataSrcMethod;
  readonly format?: HTTPRequestFormat;
  readonly prop?: string;
}

export type UpdateDataSrc = IUpdateDataSrc | string;
