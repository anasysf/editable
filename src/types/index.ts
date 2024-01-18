/** The valid JSON types. */
export type JSONValue = string | number | boolean | JSONObject | JSONArray | null;

/** The valid JSON Object. */
export interface JSONObject {
  readonly [k: string]: JSONValue;
}

/** The valid JSON Array. */
export type JSONArray = JSONValue[];

/** The HTML Table element ID. */
export type TableID = HTMLTableElement['id'];

/** The HTTP methods allowed. */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** The HTTP request's format. */
export type HTTPRequestFormat = 'json' | 'form-data';

/** A utility type that makes all the elements in K required. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type HTMLElementsWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type HTMLInputs = HTMLInputElement | HTMLTextAreaElement;
