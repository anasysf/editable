import type { IOptions } from '../editable/types';
import type { Editable } from '../editable';

declare global {
  interface JQuery {
    editable: (options: IOptions) => Editable;
  }
}
