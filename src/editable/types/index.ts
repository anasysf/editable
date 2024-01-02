import type { HTTPMethod, JSONValues } from '@/types';
import type { Config, ApiRowMethods } from 'datatables.net-bs5';
import type { HTMLElementWithValue } from '../../column/types';

export type HTTPRequestFormat = 'json' | 'form-data';

export type DataSrcHTTPMethod = Omit<HTTPMethod, 'PUT' | 'PATCH' | 'DELETE'>;

/** The `POST` dataSrc object. */
export interface IDataSrc<TData extends Record<PropertyKey, unknown> | undefined = undefined> {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method?: DataSrcHTTPMethod;
  /** The property the data content is in. */
  readonly prop?: string;
  /** Since in this case we're using the `POST` method we might want to send some formData alongside the request. */
  readonly data?: TData;
}

export type UpdateDataSrcHTTPMethod = Omit<HTTPMethod, 'GET' | 'DELETE'>;

export interface IUpdateDataSrc {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method?: UpdateDataSrcHTTPMethod;
  readonly format?: HTTPRequestFormat;
}

export type DeleteDataSrcHTTPMethod = Omit<HTTPMethod, 'GET' | 'PUT' | 'PATCH'>;

export interface IDeleteDataSrc {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method?: DeleteDataSrcHTTPMethod;
  readonly format?: HTTPRequestFormat;
}

export type PostDataSrcHTTPMethod = Omit<HTTPMethod, 'GET' | 'PUT' | 'PATCH' | 'DELETE'>;

export interface IPostDataSrc {
  /** The `source`. Could be a `URL` or a `file`. */
  readonly src: string;
  /** The method used to retrieve the data. `POST` */
  readonly method?: PostDataSrcHTTPMethod;
  readonly format?: HTTPRequestFormat;
}

/** The `dataSrc` object or `URL`. */
export type DataSrc = IDataSrc | string;
export type UpdateDataSrc = IUpdateDataSrc | string;
export type DeleteDataSrc = IDeleteDataSrc | string;
export type PostDataSrc = IPostDataSrc | string;

export type IconSrc = 'fa';
export type Icons =
  | 'delete'
  | 'edit'
  | 'save-row-edit'
  | 'cancel-row-edit'
  | 'save-new-row'
  | 'cancel-new-row';

export type IconSrcMap = Map<IconSrc, Record<Icons, HTMLElement['className']>>;

export type ClassNames =
  | 'inp-string'
  | 'inp-num'
  | 'inp-email'
  | 'textarea'
  | 'inp-valid'
  | 'inp-invalid';
export type ClassNamesMap = Map<ClassNames, HTMLElement['className']>;

interface InputInvalid<TData extends Record<string, JSONValues> = Record<string, never>> {
  readonly message: HTMLElementWithValue['validationMessage'];
  readonly table: HTMLTableElement;
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly element: HTMLElementWithValue;
  readonly value: HTMLElementWithValue['value'];
}

interface InputValid<TData extends Record<string, JSONValues> = Record<string, never>> {
  readonly table: HTMLTableElement;
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly element: HTMLElementWithValue;
  readonly value: HTMLElementWithValue['value'];
}

interface HTTPError {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
}

interface Error {
  readonly message: string;
}

interface AfterUpdated<TData extends Record<string, JSONValues> = Record<string, never>> {
  readonly table: HTMLTableElement;
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
  readonly oldRowData: TData;
}

interface BeforeCancel<TData extends Record<string, JSONValues> = Record<string, never>> {
  readonly table: HTMLTableElement;
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

interface AfterCanceled<TData extends Record<string, JSONValues> = Record<string, never>> {
  readonly table: HTMLTableElement;
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

export interface EditableEventMap<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  readonly inputValid: InputValid<TData>;
  readonly inputInvalid: InputInvalid<TData>;
  readonly httpError: HTTPError;
  readonly error: Error;
  readonly afterUpdated: AfterUpdated<TData>;
  readonly beforeCancel: BeforeCancel<TData>;
  readonly afterCanceled: AfterCanceled<TData>;
}

/**
 * The options passed to the Editable instance.
 */
export interface IOptions {
  readonly rowId: string;
  /** The dataSrc. */
  readonly dataSrc: DataSrc;
  readonly updateDataSrc: UpdateDataSrc;
  readonly deleteDataSrc: DeleteDataSrc;
  readonly postDataSrc: PostDataSrc;
  readonly editable?: boolean;
  readonly iconSrc?: IconSrc;
  readonly iconSrcMap?: Record<IconSrc, Record<Icons, HTMLElement['className']>>;
  readonly classNamesMap?: Record<ClassNames, HTMLElement['className']>;
}

export type Options = Omit<Config, 'ajax' | 'columns'> &
  Required<Pick<IOptions, 'classNamesMap' | 'editable' | 'iconSrc' | 'iconSrcMap'>> &
  IOptions;
