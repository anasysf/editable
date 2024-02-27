import type { HttpMethod, HttpRequestFormat, JsonValue } from '../../../types';

export type PostDataSrcMethod = Extract<HttpMethod, 'POST'>;

export type PostDataSrcObj = {
  readonly src: string;
  readonly method?: PostDataSrcMethod;
  readonly format?: HttpRequestFormat;
};

export type PostDataSrc = PostDataSrcObj | string;

export type Response = {
  readonly content: Record<PropertyKey, JsonValue>;
};
