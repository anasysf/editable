import type { WithRequired } from '../../../types';

export interface Options {
  readonly color?: HTMLSpanElement['className'];
}

export type NormalizedOptions = WithRequired<Options, 'color'>;
