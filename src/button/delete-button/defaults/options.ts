import type { Options, NormalizedOptions } from '../types/options';

export function defaultOptions(options?: Options): NormalizedOptions {
  const color = options?.color ?? 'text-danger';

  return {
    ...options,
    color,
  };
}
