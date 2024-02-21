import type { OptionsBASE } from '../../../types/options';

export interface CheckboxOptions extends OptionsBASE {
  readonly activeLabel: string;
  readonly inactiveLabel: string;
}

export type RequiredOptions = 'readonly' | 'required' | 'disabled';

export type NormalizedCheckboxOptions = Exclude<CheckboxOptions, RequiredOptions> &
  Required<Pick<CheckboxOptions, RequiredOptions>>;
