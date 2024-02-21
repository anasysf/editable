import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import { Events } from '../../editable/types/events';
import { isHTMLElementsWithValue } from '../../editor/utils/type-guard';
import type { HTMLElementsWithValue, JSONArray, JSONObject, JSONValue } from '../../types';
import Icon from '../../utils/html-elements/icon';
import HTTP from '../../utils/http';
import IconButtonBase from '../base';
import { ButtonTypeIconMap } from '../types';
import { defaultOptions } from './defaults/options';
import type { NormalizedOptions, Options } from './types/options';

export default class SubmitButton extends IconButtonBase<ButtonTypeIconMap.SUBMIT> {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super(ButtonTypeIconMap.SUBMIT);

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
      id: `submit-row-${rowId}-btn`,
      name: 'submit-row-btn',
      className: this._options.color,
      icon,
    });

    return element.generateHTML();
  }

  private getElementValue(element: HTMLElementsWithValue): boolean | string | number {
    if (element instanceof HTMLInputElement) {
      switch (element.type) {
        case 'checkbox':
          return element.checked;
        case 'string':
          return element.value;
        case 'number':
          return element.valueAsNumber;
        default:
          return element.value;
      }
    }

    return element.value;
  }

  public async onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    _oldRowData: TData,
    editable: Editable<TData, boolean>,
  ): Promise<void> {
    const target = evt.target;
    if (!target || target instanceof HTMLTableCellElement) return;

    if (target instanceof HTMLElement) {
      const targetName = target.getAttribute('name');
      if (
        !targetName ||
        targetName.trim().length === 0 ||
        targetName.trim() !== 'submit-row-btn'
      )
        return;
    }

    const tr = (target as HTMLElement).closest('tr');
    if (!tr) return;

    const tds = tr.cells;

    const rowData = row.data();
    const fields = editable.fields;

    const iconSrc = editable.iconSrc;
    const iconMap = editable.iconMap;
    const submitIcon = iconMap[iconSrc]['submit-row'];
    if (!submitIcon)
      throw new ReferenceError(
        `Please set a 'submit-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    const formData: Record<
      Extract<TData, keyof TData>,
      Exclude<JSONValue, JSONArray | JSONObject | null>
    > = {} as Record<
      Extract<TData, keyof TData>,
      Exclude<JSONValue, JSONArray | JSONObject | null>
    >;
    const invalidElements: HTMLElementsWithValue[] = [];

    for (const [idx, field] of fields.entries()) {
      const fieldOpts = field.options;
      const editor = fieldOpts.editor;
      if (!editor) continue;

      const fieldName = fieldOpts.name as keyof TData;
      if (!(fieldName in rowData)) continue;

      const td = tds.item(idx);
      if (!td) continue;

      const element = td.firstElementChild;
      if (!element || !isHTMLElementsWithValue(element)) continue;

      editor.setElementValue(this.getElementValue(element));
      if (!editor.validateElement()) {
        invalidElements.push(element);
        continue;
      }

      formData[fieldName as Extract<TData, keyof TData>] = editor.getElementValue();
      rowData[fieldName] = editor.getElementValue() as TData[typeof fieldName];
    }

    if (invalidElements.length !== 0) return;

    const updateDataSrc = editable.updateDataSrc;
    if (!updateDataSrc) throw new ReferenceError('Please set an `updateDataSrc` property.');

    const updateDataSrcSource = editable.updateDataSrcSource;
    if (!updateDataSrcSource || updateDataSrcSource.trim().length === 0)
      throw new ReferenceError('Please set a `src` in the `updateDataSrc` property.');

    const updateDataSrcMethod = editable.updateDataSrcMethod ?? 'PUT';
    const updateDataSrcFormat = editable.updateDataSrcFormat ?? 'json';

    const http = new HTTP(updateDataSrcSource);

    try {
      await http.update(formData, undefined, updateDataSrcMethod, updateDataSrcFormat);

      editable.emit(Events.UPDATED, { test: 'AAAAAAAAAAA' });
      row.data(rowData).draw(false);
    } catch (err) {
      console.error(err);
    }
  }
}
