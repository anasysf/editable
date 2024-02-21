import type { NormalizedOptions, Options } from '../types/options';

export function defaultOptions(options?: Options): NormalizedOptions {
  const color = options?.color ?? 'text-primary';

  return {
    ...options,
    color,
  };
}
