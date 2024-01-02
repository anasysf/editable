export type ColumnType = 'date' | 'num' | 'num-fmt' | 'html' | 'string' | 'money' | 'money-3';
export type ColumnField = 'delete' | 'edit' | 'checkbox';

export type EditorType = 'text' | 'string' | 'number' | 'email' | 'money' | 'money-3';

export type HTMLElementWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface IDataOptions {
  readonly field: ColumnField;
  readonly submittable?: boolean;
  readonly type?: ColumnType;
  readonly editor?: IEditor;
}

export interface IEditor {
  readonly type?: EditorType;
  readonly disabled?: boolean;
  readonly pattern?: string;
  readonly required?: boolean;
  readonly step?: HTMLInputElement['step'];
}
