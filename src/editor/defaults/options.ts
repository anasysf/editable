import type { EditorType, Options, NormalizedOptions } from '../types/options';

export function defaultOptions<T extends EditorType>(options: Options<T>): NormalizedOptions<T> {
  const required = options.required ?? (true as const);
  const readonly = options.readonly ?? (false as const);
  const disabled = options.disabled ?? (false as const);

  return {
    required,
    readonly,
    disabled,
    ...options,
  } as NormalizedOptions<T>;
}
