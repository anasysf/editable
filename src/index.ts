///<reference path="dts/JQuery.d.ts" />

import type { IOptions } from './editable/types';
import Editable from './editable';

(($): ((options: IOptions) => Editable) => {
  return ($.fn.editable = function (options: IOptions): Editable {
    if (!('fetch' in window))
      throw new Error(
        'Fetch is not supported on your browser you need it for the editable to function properly.',
      );

    const table = this.get(0);
    if (!table || !(table instanceof HTMLTableElement))
      throw new ReferenceError('No table was found.');

    return new Editable(table, options);
  });
})($);
