import type { EditorType } from '../../editor/types/options';
import type BaseEditor from '../../editor/base';

export type FieldType = 'string' | 'num' | 'html';

/**
 * The field options.
 * @typeParam T - The field type.
 */
export interface Options<T extends FieldType, E extends keyof EditorType> {
  /** The name of the field. */
  readonly name: string;

  /** The type of the field. */
  readonly type?: T;

  /** Whether the field is sortable or not. */
  readonly sortable?: boolean;

  /** Whether the field is visible or not. */
  readonly visible?: boolean;

  readonly editor?: BaseEditor<E>;
}

export type RequiredOptions = 'visible' | 'sortable';

/**
 * The final field options.
 * @typeParam T - The type of the field.
 */
export type NormalizedOptions<T extends FieldType, E extends keyof EditorType> = Exclude<
  Options<T, E>,
  RequiredOptions
> &
  Required<Pick<Options<T, E>, RequiredOptions>>;
