import type { OptionsBASE } from '../../../types/options';

export interface StringOptions extends OptionsBASE {
  readonly minLength?: HTMLInputElement['minLength'];
  readonly maxLength?: HTMLInputElement['maxLength'];
  readonly pattern?: HTMLInputElement['pattern'];
}

export type RequiredOptions = 'readonly' | 'required' | 'disabled';

export type NormalizedStringOptions = Exclude<StringOptions, RequiredOptions> &
  Required<Pick<StringOptions, RequiredOptions>>;
