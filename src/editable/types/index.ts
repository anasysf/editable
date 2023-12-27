import type { HTTPMethod } from '../../types';
import type { Config } from 'datatables.net-bs5';

export type DataSrcHTTPMethod = Omit<HTTPMethod, 'PUT' | 'PATCH' | 'DELETE'>;

/** The `POST` dataSrc object. */
export interface IDataSrc<TData extends Record<PropertyKey, unknown> | undefined = undefined> {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method: DataSrcHTTPMethod;
  /** The property the data content is in. */
  readonly prop?: string;
  /** Since in this case we're using the `POST` method we might want to send some formData alongside the request. */
  readonly data?: TData;
}

export type UpdateDataSrcHTTPMethod = Omit<HTTPMethod, 'GET' | 'DELETE'>;
export type HTTPRequestFormat = 'json' | 'form-data';

export interface IUpdateDataSrc<
  TData extends Record<PropertyKey, unknown> | undefined = undefined,
> {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method: UpdateDataSrcHTTPMethod;
  /** Since in this case we're using the `POST` method we might want to send some formData alongside the request. */
  readonly data?: TData;
  readonly format?: HTTPRequestFormat;
}

/** The `dataSrc` object or `URL`. */
export type DataSrc = IDataSrc | string;
export type UpdateDataSrc = IUpdateDataSrc | string;

export type IconSrc = 'fa';
type Icons = 'delete' | 'edit' | 'save-row-edit' | 'cancel-row-edit';

export type IconSrcMap = Map<IconSrc, Record<Icons, HTMLElement['className']>>;

/**
 * The options passed to the Editable instance.
 */
export interface IOptions {
  /** The dataSrc. */
  readonly dataSrc: DataSrc;
  readonly updateDataSrc: UpdateDataSrc;
  readonly iconSrc?: IconSrc;
}

export type Options = Omit<Config, 'ajax' | 'columns'> & IOptions;
