import type { NormalizedOptions, Options, FieldType, RequiredOptions } from '../types/options';
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
export function defaultOptions<T extends FieldType, E extends keyof EditorType>(
  options: Options<T, E>,
): NormalizedOptions<T, E> {
  const defaultOpts = {
    sortable: options.sortable ?? true,
    visible: options.visible ?? true,
  } satisfies Pick<Options<T, E>, RequiredOptions>;

  return { ...defaultOpts, ...options };
}
