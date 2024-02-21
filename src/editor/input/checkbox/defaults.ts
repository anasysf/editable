import type { CheckboxOptions, NormalizedCheckboxOptions, RequiredOptions } from './types';

export function defaultOptions(options: CheckboxOptions): NormalizedCheckboxOptions {
  const defaultOpts = {
    disabled: false,
    readonly: false,
    required: false,
  } satisfies Pick<NormalizedCheckboxOptions, RequiredOptions>;

  return { ...defaultOpts, ...options };
}
