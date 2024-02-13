import IconButtonBase from '../base';
import type { Options, NormalizedOptions } from './types/options';
import Icon from '../../utils/html-elements/icon';
import { defaultOptions } from './defaults/options';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type { JSONValue } from '../../types';
import type { HTMLElementsWithValue } from '../../types';
import { replaceDeleteIcon, replaceEditIcon } from '../../editable/utils';
import type Editable from '../../editable';
import { ButtonTypeIconMap } from '../types';
import SubmitButton from '../submit-button';
import CancelButton from '../cancel-button';

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
      id: `edit-row-${rowId}-btn`,
      name: 'edit-row-btn',
      className: this.className,
      icon,
    });

    return element.generateHTML();
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
      if (!targetName || targetName.trim().length === 0 || targetName.trim() !== 'edit-row-btn')
        return;
    }

    const rowData = row.data();
    const oldRowData = structuredClone(rowData);
    const rowIdx = row.index();
    const fields = editable.fields;

    const iconSrc = editable.iconSrc;
    const iconMap = editable.iconMap;

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

    const elements: HTMLElementsWithValue[] = [];
    for (const field of fields) {
      const fieldOpts = field.options;
      const editor = fieldOpts.editor;
      if (!editor) continue;

      const fieldName = fieldOpts.name as keyof TData;
      if (!(fieldName in rowData)) continue;

      const element = editor.generateHTML(
        fieldName as Extract<keyof typeof fieldName, string>,
        rowIdx,
        rowData[fieldName] as Extract<TData[typeof fieldName], string>,
      );

      rowData[fieldName] = element.outerHTML as Extract<TData, TData[typeof fieldName]>;
      elements.push(element);
    }

    if (elements.length !== 0) {
      row.data(rowData).draw(false);

      const submitBtn = replaceEditIcon(row, editable, submitButton);
      submitBtn.addEventListener('click', (evt): void => {
        void submitButton.onClick(evt, row, oldRowData, editable);
      });

      const cancelBtn = replaceDeleteIcon(row, editable, cancelButton);
      cancelBtn.addEventListener('click', (evt): void => {
        cancelButton.onClick(evt, row, oldRowData, editable);
      });
    }
  }
}
