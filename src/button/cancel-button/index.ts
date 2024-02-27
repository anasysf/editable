import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import type { JsonValue } from '../../types';
import Icon from '../../utils/html-elements/icon';
import IconButtonBase from '../base';
import { ButtonTypeIconMap } from '../types';
import { defaultOptions } from './defaults/options';
import type { NormalizedOptions, Options } from './types/options';

export default class CancelButton extends IconButtonBase<ButtonTypeIconMap.CANCEL> {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super(ButtonTypeIconMap.CANCEL);

    const opts = defaultOptions(options);

    this._options = opts;
  }

  public generateHtml<T extends Record<string, JsonValue>>(
    row: ApiRowMethods<T>,
    editable: Editable<T, boolean>,
  ): HTMLSpanElement {
    const rowId = row.id().trim() === 'undefined' ? row.index() : row.id();
    const icon = super.getIconByType(editable.iconSrc, editable.iconMap);
    if (!icon)
      throw new ReferenceError(
        `Could not find an icon for the type: ${this.type}, the iconSrc: ${editable.iconSrc}.`,
      );

    const element = new Icon({
      id: `cancel-row-${rowId}-btn`,
      name: 'cancel-row-btn',
      className: this._options.color,
      icon,
    });

    return element.generateHtml();
  }

  public onClick<T extends Record<string, JsonValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<T>,
    oldRowData: T,
    _editable: Editable<T, boolean>,
  ): void {
    const { target } = evt;
    if (!target || target instanceof HTMLTableCellElement) return;

    if (target instanceof HTMLElement) {
      const targetName = target.getAttribute('name');
      if (
        !targetName ||
        targetName.trim().length === 0 ||
        targetName.trim() !== 'cancel-row-btn'
      )
        return;
    }

    row.data(oldRowData).draw(false);
  }
}
