import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../../editable';
import { Events } from '../../editable/types/events';
import { isHtmlElementsWithValue } from '../../editor/utils/type-guard';
import type { HtmlElementsWithValue, JsonArray, JsonObject, JsonValue } from '../../types';
import Icon from '../../utils/html-elements/icon';
import Http from '../../utils/http';
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
      id: `submit-row-${rowId}-btn`,
      name: 'submit-row-btn',
      className: this._options.color,
      icon,
    });

    return element.generateHtml();
  }

  public async onClick<T extends Record<string, JsonValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<T>,
    _oldRowData: T,
    editable: Editable<T, boolean>,
  ): Promise<void> {
    const { target } = evt;
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

    const rowId = row.id();
    const rowIdKey = editable.options.rowId;

    if (!rowIdKey) throw new ReferenceError('Please set a `rowId`.');

    const rowIdMap = {
      [rowIdKey]: rowId,
    };

    const rowData = row.data();
    const { fields } = editable;

    const { iconSrc } = editable;
    const { iconMap } = editable;
    const submitIcon = iconMap[iconSrc]['submit-row'];
    if (!submitIcon)
      throw new ReferenceError(
        `Please set a 'submit-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
    const formData = {
      ...rowData,
      ...rowIdMap,
      /* eslint-disable-next-line */
    } as Record<Extract<T, keyof T>, Exclude<JsonValue, JsonArray | JsonObject | null>>;
    const invalidElements: HtmlElementsWithValue[] = [];

    for (const [idx, field] of fields.entries()) {
      const fieldOpts = field.options;
      const { editor } = fieldOpts;
      if (!editor) continue;

      const fieldName = fieldOpts.name;
      // If (!(fieldName in rowData)) continue;

      const td = tds.item(idx);
      if (!td) continue;

      const element = td.firstElementChild;
      if (!element || !isHtmlElementsWithValue(element)) continue;

      editor.setElementValue(this.getElementValue(element));
      if (!editor.validateElement()) {
        invalidElements.push(element);
        continue;
      }

      formData[fieldName as Extract<T, keyof T>] = editor.getElementValue();
      /* If (isSelectStaticEditor(editor))
        rowData[fieldName as keyof T] = ((): string =>
          editor.getElementValue() as string) as T[keyof T]; */
      // else
      rowData[fieldName as keyof T] = editor.getElementValue() as T[typeof fieldName];
    }

    if (invalidElements.length !== 0) return;

    const { updateDataSrc } = editable;
    if (!updateDataSrc) throw new ReferenceError('Please set an `updateDataSrc` property.');

    const { updateDataSrcSource } = editable;
    if (!updateDataSrcSource || updateDataSrcSource.trim().length === 0)
      throw new ReferenceError('Please set a `src` in the `updateDataSrc` property.');

    const updateDataSrcMethod = editable.updateDataSrcMethod ?? 'PUT';
    const updateDataSrcFormat = editable.updateDataSrcFormat ?? 'json';

    const http = new Http(updateDataSrcSource);

    try {
      await http.update(formData, undefined, updateDataSrcMethod, updateDataSrcFormat);

      editable.emit(Events.UPDATED, { test: 'AAAAAAAAAAA' });
      row.data(rowData).draw(false);
    } catch (err) {
      console.error(err);
    }
  }

  private getElementValue(element: HtmlElementsWithValue): boolean | string | number {
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
}
