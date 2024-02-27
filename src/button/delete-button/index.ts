import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import { Events } from '../../editable/types/events';
import type { JsonValue } from '../../types';
import Icon from '../../utils/html-elements/icon';
import Http from '../../utils/http';
import IconButtonBase from '../base';
import { ButtonTypeIconMap } from '../types';
import { defaultOptions } from './defaults/options';
import type { NormalizedOptions, Options } from './types/options';

export default class DeleteButton extends IconButtonBase<ButtonTypeIconMap.DELETE> {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super(ButtonTypeIconMap.DELETE);

    const opts = defaultOptions(options);

    this._options = opts;
  }

  public get options(): NormalizedOptions {
    return this._options;
  }

  public get color(): HTMLSpanElement['className'] {
    return this.options.color;
  }

  public get className(): HTMLSpanElement['className'] {
    return this.color;
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
      id: `delete-row-${rowId}-btn`,
      name: 'delete-row-btn',
      className: this.className,
      icon,
    });

    return element.generateHtml();
  }

  public onClick<T extends Record<string, JsonValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<T>,
    _oldRowData: T,
    editable: Editable<T, boolean>,
  ): void {
    const { target } = evt;
    if (!target || target instanceof HTMLTableCellElement) return;

    if (target instanceof HTMLElement) {
      const targetName = target.getAttribute('name');
      if (
        !targetName ||
        targetName.trim().length === 0 ||
        targetName.trim() !== 'delete-row-btn'
      )
        return;
    }

    const rowId = row.id();
    const rowIdKey = editable.options.rowId;

    if (!rowIdKey) throw new ReferenceError('Please set a `rowId`.');

    const rowIdMap = {
      [rowIdKey]: rowId,
    };

    const { deleteDataSrc } = editable;
    if (!deleteDataSrc) throw new ReferenceError('Please set a `deleteDataSrc` property.');

    const { deleteDataSrcSource } = editable;
    if (!deleteDataSrcSource || deleteDataSrcSource.trim().length === 0)
      throw new ReferenceError('Please set a `src` in the `deleteDataSrc` property.');

    const deleteDataSrcMethod = editable.deleteDataSrcMethod ?? 'DELETE';
    const deleteDataSrcFormat = editable.deleteDataSrcFormat ?? 'json';

    const http = new Http(deleteDataSrcSource);

    editable.emit(Events.DELETE, {
      async deleteRow(confirmDelete = true): Promise<void> {
        if (!confirmDelete) return;

        try {
          await http.delete(rowIdMap, undefined, deleteDataSrcMethod, deleteDataSrcFormat);
          row.remove().draw(false);
        } catch (err) {
          console.error(err);
        }
      },
    });
  }
}
