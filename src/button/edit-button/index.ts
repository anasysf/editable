import ButtonBase from '../base';
import type { Options, NormalizedOptions } from './types/options';
import Icon from '../../utils/html-elements/icon';
import { defaultOptions } from './defaults/options';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type { JSONValue } from '../../types';
import type { HTMLElementsWithValue } from '../../types';
import { replaceEditIcon } from '../../editable/utils';
import type Editable from '../../editable';

export default class EditButton extends ButtonBase {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super();

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
    icon: HTMLElement['className'],
  ): HTMLSpanElement {
    const rowIdx = row.index();

    const element = new Icon({
      id: `edit-row-${rowIdx}-btn`,
      name: 'edit-row-btn',
      className: this.className,
      icon,
    });

    return element.generateHTML();
  }

  public onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    editable: Editable<TData>,
  ): void {
    const target = evt.target;
    if (!target || target instanceof HTMLTableCellElement) return;

    const rowData = row.data();
    const rowIdx = row.index();
    const fields = editable.fields;

    const iconSrc = editable.iconSrc;
    const iconMap = editable.iconMap;
    const submitIcon = iconMap[iconSrc]['submit-row'];
    if (!submitIcon)
      throw new ReferenceError(
        `Please set a 'submit-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    const inputElements: HTMLElementsWithValue[] = [];
    for (const field of fields) {
      const editor = field.editor;
      if (!editor) continue;

      const fieldName = field.name as keyof TData;
      const inputElement = editor.generateHTML(
        fieldName as Extract<keyof typeof fieldName, string>,
        rowIdx,
      );

      if (!(fieldName in rowData)) continue;

      rowData[fieldName] = inputElement.outerHTML as Extract<TData, TData[typeof fieldName]>;

      inputElements.push(inputElement);
    }

    if (inputElements.length !== 0) {
      row.data(rowData).draw(false);
      replaceEditIcon(rowIdx, submitIcon, 'text-success');
    }
  }
}
