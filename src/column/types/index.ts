export type ColumnType =
  | 'date'
  | 'num'
  | 'num-fmt'
  | 'html'
  | 'string'
  | 'money'
  | 'money-3'
  | 'list-dyn';
export type ColumnField = 'delete' | 'edit' | 'checkbox';

export type EditorType = 'text' | 'string' | 'number' | 'email' | 'money' | 'money-3';

export type HTMLElementWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface IDataOptions {
  readonly field: ColumnField;
  readonly submittable?: boolean;
  readonly type?: ColumnType;
  readonly editor?: IEditor;
  readonly src?: string;
}

export type IEditor<T extends EditorType = EditorType> = T extends 'string' | 'text' | 'email'
  ? {
      readonly type?: T;
      readonly disabled?: boolean;
      readonly required?: boolean;
      readonly pattern?: string;
      readonly maxLength?: HTMLInputElement['maxLength'];
    }
  : {
      readonly type?: T;
      readonly disabled?: boolean;
      readonly required?: boolean;
      readonly step?: HTMLInputElement['step'];
      readonly min?: HTMLInputElement['min'];
      readonly max?: HTMLInputElement['max'];
    };
