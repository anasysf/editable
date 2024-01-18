import type { NormalizedOptions, Options, FieldType } from '../types/options';
import type { EditorType } from '../../editor/types/options';

/**
 * Set the default options.
 * @param options - The options passed.
 *
 * @typeParam T - The field type.
 * @typeParam E - The editor type.
 *
 * @returns The default options.
 */
export function defaultOptions<T extends FieldType, E extends EditorType>(
  options: Options<T, E>,
): NormalizedOptions<T, E> {
  const name = options.name;
  const type = options.type;
  const sortable = options.sortable ?? (true as const);
  const visible = options.visible ?? (true as const);

  return {
    ...options,
    name,
    type,
    sortable,
    visible,
  };
}
