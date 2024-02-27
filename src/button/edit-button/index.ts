import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import { replaceDeleteIcon, replaceEditIcon } from '../../editable/utils';
import type { HtmlElementsWithValue, JsonValue } from '../../types';
import Icon from '../../utils/html-elements/icon';
import IconButtonBase from '../base';
import CancelButton from '../cancel-button';
import SubmitButton from '../submit-button';
import { ButtonTypeIconMap } from '../types';
import { defaultOptions } from './defaults/options';
import type { NormalizedOptions, Options } from './types/options';

export default class EditButton extends IconButtonBase<ButtonTypeIconMap.EDIT> {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super(ButtonTypeIconMap.EDIT);

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
      id: `edit-row-${rowId}-btn`,
      name: 'edit-row-btn',
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
      if (!targetName || targetName.trim().length === 0 || targetName.trim() !== 'edit-row-btn')
        return;
    }

    const tr = (target as HTMLElement).closest('tr');
    if (!tr) throw new ReferenceError('No <tr> found.');

    const tds = tr.cells;

    const rowData = row.data();
    const oldRowData = structuredClone(rowData);
    const rowIdx = row.index();
    const { fields } = editable;

    const { iconSrc } = editable;
    const { iconMap } = editable;

    const submitButton = new SubmitButton();
    const submitIcon = submitButton.getIconByType(iconSrc, iconMap);
    if (!submitIcon)
      throw new ReferenceError(
        `Please set a 'submit-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    const cancelButton = new CancelButton();
    const cancelIcon = cancelButton.getIconByType(iconSrc, iconMap);
    if (!cancelIcon)
      throw new ReferenceError(
        `Please set a 'cancel-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    const elements: HtmlElementsWithValue[] = [];
    for (const [idx, field] of fields.entries()) {
      const fieldOpts = field.options;

      const { editor } = fieldOpts;
      if (!editor) continue;

      const fieldName = fieldOpts.name as keyof T;
      if (!(fieldName in rowData)) continue;

      const td = tds.item(idx);
      if (!td) continue;

      const element = editor.generateHtml(
        fieldName as Extract<keyof typeof fieldName, string>,
        rowData[fieldName] as Extract<T[typeof fieldName], string | boolean>,
        rowIdx,
      );

      td.innerHTML = element.outerHTML;
      elements.push(element);
    }

    if (elements.length !== 0) {
      const submitBtn = replaceEditIcon(row, editable, submitButton);
      const cancelBtn = replaceDeleteIcon(row, editable, cancelButton);

      submitBtn.addEventListener('click', (evt): void => {
        void submitButton.onClick(evt, row, oldRowData, editable);
      });

      cancelBtn.addEventListener('click', (evt): void => {
        cancelButton.onClick(evt, row, oldRowData, editable);
      });
    }
  }
}
