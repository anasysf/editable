// import './JQuery.d';
///<reference path="./JQuery.d.ts" />

import type { IOptions } from './editable/types';
import Editable from './editable';

(($): void => {
  ($.fn as JQuery<HTMLTableElement>).editable = function (options: IOptions): Editable {
    return new Editable(this.get(0), options);
  };
})($);
