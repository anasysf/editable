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
export type DeleteDataSrcHTTPMethod = Omit<HTTPMethod, 'GET' | 'PUT' | 'PATCH'>;
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

export interface IDeleteDataSrc {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method: DeleteDataSrcHTTPMethod;
  readonly format?: HTTPRequestFormat;
}

/** The `dataSrc` object or `URL`. */
export type DataSrc = IDataSrc | string;
export type UpdateDataSrc = IUpdateDataSrc | string;
export type DeleteDataSrc = IDeleteDataSrc | string;

export type IconSrc = 'fa';
type Icons = 'delete' | 'edit' | 'save-row-edit' | 'cancel-row-edit';

export type IconSrcMap = Map<IconSrc, Record<Icons, HTMLElement['className']>>;

/**
 * The options passed to the Editable instance.
 */
export interface IOptions {
  readonly rowId: string;
  /** The dataSrc. */
  readonly dataSrc: DataSrc;
  readonly updateDataSrc: UpdateDataSrc;
  readonly deleteDataSrc: DeleteDataSrc;
  readonly iconSrc?: IconSrc;
  readonly onHTTPError?: (status: number, statusText: string, url: string) => void;
}

export type Options = Omit<Config, 'ajax' | 'columns'> & IOptions;
