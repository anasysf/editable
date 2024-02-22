import type { HTTPMethod, HTTPRequestFormat, JSONValue } from '../../../types';

export type PostDataSrcMethod = Extract<HTTPMethod, 'POST'>;

export interface IPostDataSrc {
  readonly src: string;
  readonly method?: PostDataSrcMethod;
  readonly format?: HTTPRequestFormat;
}

export type PostDataSrc = IPostDataSrc | string;

/* eslint-disable-next-line */
export type Response = {
  readonly content: Record<PropertyKey, JSONValue>;
};
