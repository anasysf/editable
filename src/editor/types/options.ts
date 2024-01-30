import type { HTMLElementsWithValue, HTMLInputs } from '../../types';

// type EditorTypes = 'string' | 'number' | 'text';

export interface EditorType {
  readonly string: HTMLInputElement;
  readonly number: HTMLInputElement;
  readonly text: HTMLTextAreaElement;
}

/* export type StringEditorType = Extract<EditorType, EditorType.STRING | EditorType.TEXT>;
export type NumberEditorType = Extract<EditorType, EditorType.NUMBER>;

interface OptionsBASE<T extends EditorType> {
  readonly type: T;
  readonly className?: HTMLElementsWithValue['className'];
  readonly required?: HTMLElementsWithValue['required'];
  readonly readonly?: HTMLInputs['readOnly'];
  readonly disabled?: HTMLElementsWithValue['disabled'];
}

export type StringOptions<T extends StringEditorType> = OptionsBASE<T> & {
  readonly minLength?: HTMLInputElement['minLength'];
  readonly maxLength?: HTMLInputElement['maxLength'];
  readonly pattern?: HTMLInputElement['pattern'];
};

export type NumberOptions<T extends NumberEditorType> = OptionsBASE<T> & {
  readonly min?: HTMLInputElement['min'];
  readonly max?: HTMLInputElement['max'];
  readonly step?: HTMLInputElement['step'];
};

export type Options<T extends EditorType> =
  T extends Extract<T, StringEditorType>
    ? StringOptions<Extract<T, StringEditorType>>
    : NumberOptions<Extract<T, NumberEditorType>>;

export type NormalizedOptions<T extends EditorType> = WithRequired<
  OptionsBASE<T>,
  'required' | 'readonly' | 'disabled'
>; */

export interface OptionsBASE {
  readonly className?: HTMLElementsWithValue['className'];
  readonly required?: HTMLElementsWithValue['required'];
  readonly readonly?: HTMLInputs['readOnly'];
  readonly disabled?: HTMLElementsWithValue['disabled'];
}
