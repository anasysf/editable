import type { WithRequired } from '../../../types';

export type Options = {
  readonly color?: HTMLSpanElement['className'];
};

export type NormalizedOptions = WithRequired<Options, 'color'>;
