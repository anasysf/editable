import type BaseEditor from '../../editor/base';
import type { EditorType } from '../../editor/types/options';

export type FieldType = 'string' | 'num' | 'html';

export type OptionsBase = {
  /** The name of the field. */
  readonly name: string;
};

/**
 * The field options.
 * @typeParam T - The field type.
 */
export type Options<T extends FieldType, E extends keyof EditorType> = {
  /** The type of the field. */
  readonly type?: T;

  /** Whether the field is sortable or not. */
  readonly orderable?: boolean;

  /** Whether the field is visible or not. */
  readonly visible?: boolean;

  readonly editor?: BaseEditor<E>;
} & OptionsBase;

export type RequiredOptions = 'visible' | 'orderable';

/**
 * The final field options.
 * @typeParam T - The type of the field.
 */
export type NormalizedOptions<T extends FieldType, E extends keyof EditorType> = Exclude<
  Options<T, E>,
  RequiredOptions
> &
  Required<Pick<Options<T, E>, RequiredOptions>>;
