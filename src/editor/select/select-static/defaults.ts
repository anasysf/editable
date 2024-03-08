import type { NormalizedSelectOptions, SelectOptions } from './types';

export function defaultOptions(options: SelectOptions): NormalizedSelectOptions {
  const defaultOpts = {
    disabled: false,
    required: true,
  };

  return { ...defaultOpts, ...options };
}
