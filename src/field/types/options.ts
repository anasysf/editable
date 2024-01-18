import type { WithRequired } from '../../types';
import type { EditorType } from '../../editor/types/options';
import type Editor from '../../editor';

export enum FieldType {
  STRING = 'string',
  NUM = 'num',
  HTML = 'html',
}

/**
 * The field options.
 * @typeParam T - The field type.
 */
export interface Options<T extends FieldType, E extends EditorType> {
  /** The name of the field. */
  readonly name: string;

  /** The type of the field. */
  readonly type?: T;

  /** Whether the field is sortable or not. */
  readonly sortable?: boolean;

  /** Whether the field is visible or not. */
  readonly visible?: boolean;

  readonly editor?: Editor<E>;
}

/**
 * The final field options.
 * @typeParam T - The type of the field.
 */
export type NormalizedOptions<T extends FieldType, E extends EditorType> = WithRequired<
  Options<T, E>,
  'sortable' | 'visible'
>;
