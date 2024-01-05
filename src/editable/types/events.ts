import type { JSONValues } from '@/types';
import type { HTMLElementWithValue } from '@/column/types';
import type { ApiRowMethods } from 'datatables.net-bs5';

export enum EditableEvent {
  INPUT_INVALID = 'input-invalid',
  INPUT_VALID = 'input-valid',
  HTTP_ERROR = 'http-error',
  ERROR = 'error',
  EDIT = 'edit',
  EDITED = 'edited',
  UPDATED = 'updated',
  DELETE = 'delete',
  DELETED = 'deleted',
  NEW_ROW = 'new-row',
  NEW_ROW_SAVE = 'new-row-save',
  NEW_ROW_SAVED = 'new-row-saved',
  NEW_ROW_CANCEL = 'new-row-cancel',
  NEW_ROW_CANCELLED = 'new-row-cancelled',
  CANCEL = 'cancel',
  CANCELLED = 'cancelled',
}

interface InputValid<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly element: HTMLElementWithValue;
  readonly value: HTMLElementWithValue['value'];
}

interface InputInvalid<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly message: HTMLElementWithValue['validationMessage'];
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

interface Edit<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
  readonly elements: HTMLElementWithValue[];
}

interface Edited<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
  readonly oldRowData: TData;
}

interface Updated<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
  readonly oldRowData: TData;
  readonly response: Record<string, unknown> | Record<string, unknown>[];
}

interface Delete<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

interface Deleted<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

interface NewRow<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
}

interface NewRowSave<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

interface NewRowSaved<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
  readonly response: unknown;
}

interface NewRowCancel<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
}

interface NewRowCancelled<
  TData extends Record<string, JSONValues> = Record<string, JSONValues>,
> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
}

interface Cancel<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

interface Cancelled<TData extends Record<string, JSONValues> = Record<string, JSONValues>> {
  readonly tr: HTMLTableRowElement;
  readonly row: ApiRowMethods<TData>;
  readonly rowData: TData;
}

export interface EditableEventsMap<
  TData extends Record<string, JSONValues> = Record<string, JSONValues>,
> extends Record<string, unknown> {
  readonly [EditableEvent.INPUT_INVALID]: InputInvalid<TData>;
  readonly [EditableEvent.INPUT_VALID]: InputValid<TData>;
  readonly [EditableEvent.HTTP_ERROR]: HTTPError;
  readonly [EditableEvent.ERROR]: Error;
  readonly [EditableEvent.EDIT]: Edit<TData>;
  readonly [EditableEvent.EDITED]: Edited<TData>;
  readonly [EditableEvent.UPDATED]: Updated<TData>;
  readonly [EditableEvent.DELETE]: Delete<TData>;
  readonly [EditableEvent.DELETED]: Deleted<TData>;
  readonly [EditableEvent.NEW_ROW]: NewRow<TData>;
  readonly [EditableEvent.NEW_ROW_SAVE]: NewRowSave<TData>;
  readonly [EditableEvent.NEW_ROW_SAVED]: NewRowSaved<TData>;
  readonly [EditableEvent.NEW_ROW_CANCEL]: NewRowCancel<TData>;
  readonly [EditableEvent.NEW_ROW_CANCELLED]: NewRowCancelled<TData>;
  readonly [EditableEvent.CANCEL]: Cancel<TData>;
  readonly [EditableEvent.CANCELLED]: Cancelled<TData>;
}
