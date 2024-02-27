import type { OptionsBase } from '../../../types/options';

export type StringOptions = {
  readonly minLength?: HTMLInputElement['minLength'];
  readonly maxLength?: HTMLInputElement['maxLength'];
  readonly pattern?: HTMLInputElement['pattern'];
} & OptionsBase;

export type RequiredOptions = 'readonly' | 'required' | 'disabled';

export type NormalizedStringOptions = Exclude<StringOptions, RequiredOptions> &
  Required<Pick<StringOptions, RequiredOptions>>;
