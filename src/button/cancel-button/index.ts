import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import type { JSONValue } from '../../types';
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

  public generateHTML<TData extends Record<string, JSONValue>>(
    row: ApiRowMethods<TData>,
    editable: Editable<TData, boolean>,
  ): HTMLSpanElement {
    const rowId = row.id().trim() !== 'undefined' ? row.id() : row.index();
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

    return element.generateHTML();
  }

  public onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    oldRowData: TData,
    _editable: Editable<TData, boolean>,
  ): void {
    const target = evt.target;
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
