///<reference path="dts/JQuery.d.ts" />

import type { IOptions } from './editable/types';
import Editable from './editable';

(($): ((options: IOptions) => Editable) => {
  return ($.fn.editable = function (options: IOptions): Editable {
    return new Editable(this.get(0), options);
  });
})($);
