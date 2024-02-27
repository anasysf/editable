import type { OptionsBase } from '../../../types/options';

export type CheckboxOptions = {
  readonly activeLabel: string;
  readonly inactiveLabel: string;
} & OptionsBase;

export type RequiredOptions = 'readonly' | 'required' | 'disabled';

export type NormalizedCheckboxOptions = Exclude<CheckboxOptions, RequiredOptions> &
  Required<Pick<CheckboxOptions, RequiredOptions>>;
