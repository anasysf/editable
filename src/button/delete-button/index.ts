import IconButtonBase from '../base';
import type { Options, NormalizedOptions } from './types/options';
import Icon from '../../utils/html-elements/icon';
import { defaultOptions } from './defaults/options';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type { JSONValue } from '../../types';
import type Editable from '../../editable';
import { ButtonTypeIconMap } from '../types';
import HTTP from '../../utils/http';
import { Events } from '../../editable/types/events';

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
      id: `delete-row-${rowId}-btn`,
      name: 'delete-row-btn',
      className: this.className,
      icon,
    });

    return element.generateHTML();
  }

  private deleteCB<TData extends Record<string, JSONValue>>(
    deleteConfirmed: boolean,
    row: ApiRowMethods<TData>,
  ): boolean {
    if (!deleteConfirmed) return deleteConfirmed;

    row.remove().draw(false);
    return deleteConfirmed;
  }

  public onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    _oldRowData: TData,
    editable: Editable<TData, boolean>,
  ): void {
    const target = evt.target;
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

    const deleteDataSrc = editable.deleteDataSrc;
    if (!deleteDataSrc) throw new ReferenceError('Please set a `deleteDataSrc` property.');

    const deleteDataSrcSource = editable.deleteDataSrcSource;
    if (!deleteDataSrcSource || deleteDataSrcSource.trim().length === 0)
      throw new ReferenceError('Please set a `src` in the `deleteDataSrc` property.');

    const deleteDataSrcMethod = editable.deleteDataSrcMethod ?? 'DELETE';
    const deleteDataSrcFormat = editable.deleteDataSrcFormat ?? 'json';

    const http = new HTTP(deleteDataSrcSource);
    try {
      editable.emit(Events.DELETE, {
        deleteCB: async (deleteConfirmed: boolean): Promise<boolean> => {
          await http.delete(rowIdMap, undefined, deleteDataSrcMethod, deleteDataSrcFormat);
          return this.deleteCB(deleteConfirmed, row);
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
