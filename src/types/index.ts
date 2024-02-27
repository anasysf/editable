/** The valid JSON types. */
/* eslint-disable-next-line */
export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

/** The valid JSON Object. */
/* eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style */
export type JsonObject = {
  readonly [k: string]: JsonValue;
};

/** The valid JSON Array. */
export type JsonArray = JsonValue[];

/** The HTML Table element ID. */
export type TableId = HTMLTableElement['id'];

/** The HTTP methods allowed. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** The HTTP request's format. */
export type HttpRequestFormat = 'json' | 'form-data';

/** A utility type that makes all the elements in K required. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type HtmlElementsWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type HtmlInputs = HTMLInputElement | HTMLTextAreaElement;
