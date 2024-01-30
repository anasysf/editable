import type { NormalizedStringOptions, RequiredOptions, StringOptions } from './types';

export function defaultOptions(options?: StringOptions): NormalizedStringOptions {
  const defaultOpts = {
    disabled: false,
    readonly: false,
    required: true,
  } satisfies Pick<NormalizedStringOptions, RequiredOptions>;

  return { ...defaultOpts, ...options };
}
