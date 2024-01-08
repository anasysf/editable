export type ColumnType =
  | 'date'
  | 'num'
  | 'num-fmt'
  | 'html'
  | 'string'
  | 'money'
  | 'money-3'
  | 'list-stc';
export type ColumnField = 'delete' | 'edit' | 'checkbox';

export type EditorType =
  | 'text'
  | 'string'
  | 'number'
  | 'email'
  | 'money'
  | 'money-3'
  | 'list-stc';

export type HTMLElementWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type IDataOptions<T extends ColumnType = ColumnType> = T extends 'list-stc'
  ? {
      readonly field: ColumnField;
      readonly submittable?: boolean;
      readonly type?: T;
      readonly editor?: IEditor<'list-stc'>;
      readonly data: Record<string, unknown>[];
    }
  : {
      readonly field: ColumnField;
      readonly submittable?: boolean;
      readonly type?: T;
      readonly editor?: IEditor;
    };

export type IEditor<T extends EditorType = EditorType> = T extends 'string' | 'text' | 'email'
  ? {
      readonly type?: T;
      readonly disabled?: boolean;
      readonly required?: boolean;
      readonly pattern?: string;
      readonly maxLength?: HTMLInputElement['maxLength'];
    }
  : T extends 'list-stc'
    ? {
        readonly type?: T;
        readonly disabled?: boolean;
        readonly required?: boolean;
      }
    : {
        readonly type?: T;
        readonly disabled?: boolean;
        readonly required?: boolean;
        readonly step?: HTMLInputElement['step'];
        readonly min?: HTMLInputElement['min'];
        readonly max?: HTMLInputElement['max'];
      };
