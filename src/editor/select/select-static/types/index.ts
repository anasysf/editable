import { type JsonArray, type JsonObject, type JsonValue } from '../../../../types';
import type { OptionsBase } from '../../../types/options';

export type SelectOptions = {
  /* eslint-disable-next-line */
  readonly data: Array<Record<string, Exclude<JsonValue, null | JsonObject | JsonArray>>>;
  readonly prop: string;
  readonly id: string | number;
} & Exclude<OptionsBase, 'readonly'>;

export type RequiredOptions = 'required' | 'disabled';

export type NormalizedSelectOptions = Exclude<SelectOptions, RequiredOptions> &
  Required<Pick<SelectOptions, RequiredOptions>>;
