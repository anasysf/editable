import type { EditorTypeMap } from '../../editor/types/options';
import type { FieldType, NormalizedOptions, Options, RequiredOptions } from '../types/options';

/**
 * Set the default options.
 * @param options - The options passed.
 *
 * @typeParam T - The field type.
 * @typeParam E - The editor type.
 *
 * @returns The default options.
 */
export function defaultOptions<T extends FieldType, E extends keyof EditorTypeMap | undefined>(
  options: Options<T, E>,
): NormalizedOptions<T, E> {
  const defaultOpts = {
    orderable: options.orderable ?? true,
    visible: options.visible ?? true,
  } satisfies Pick<Options<T, E>, RequiredOptions>;

  return { ...defaultOpts, ...options };
}
