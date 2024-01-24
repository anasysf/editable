import IconButtonBase from '../base';
import type { Options, NormalizedOptions } from './types/options';
import Icon from '../../utils/html-elements/icon';
import { defaultOptions } from './defaults/options';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type { JSONArray, JSONObject, JSONValue } from '../../types';
import type { HTMLElementsWithValue } from '../../types';
import type Editable from '../../editable';
import { ButtonTypeIconMap } from '../types';
import { isHTMLElementsWithValue } from '../../editor/utils/type-guard';
import HTTP from '../../utils/http';
import { Events } from '../../editable/types/events';

export default class SubmitButton extends IconButtonBase<ButtonTypeIconMap.SUBMIT> {
  private readonly _options: NormalizedOptions;

  public constructor(options?: Options) {
    super(ButtonTypeIconMap.SUBMIT);

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
    const rowIdx = row.index();
    const icon = super.getIconByType(editable.iconSrc, editable.iconMap);
    if (!icon)
      throw new ReferenceError(
        `Could not find an icon for the type: ${this.type}, the iconSrc: ${editable.iconSrc}.`,
      );

    const element = new Icon({
      id: `submit-row-${rowIdx}-btn`,
      name: 'submit-row-btn',
      className: this.className,
      icon,
    });

    return element.generateHTML();
  }

  public async onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
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
      const editor = field.editor;
      if (!editor) continue;

      const fieldName = field.name as keyof TData;
      if (!(fieldName in rowData)) continue;

      const td = tds.item(idx);
      if (!td) continue;

      const element = td.firstElementChild;
      if (!element || !isHTMLElementsWithValue(element)) continue;

      editor.value = element.value;
      if (!editor.validate()) {
        console.error(element.validationMessage, element.validity);
        invalidElements.push(element);
        continue;
      }

      formData[fieldName as Extract<TData, keyof TData>] = editor.value;
      rowData[fieldName] = editor.value as TData[typeof fieldName];
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
