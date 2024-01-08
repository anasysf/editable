import type Column from '@/column';
import type { IEditor, HTMLElementWithValue } from '../types';
import type { ClassNamesMap } from '@/editable/types';
import type { JSONValues } from '@/types';
import { formatNumber } from '@utils';
import { defaultEditorOptions } from './defaults';
import { isIEditorString, isIEditorNumber, isIEditorListStc } from './utils';

export default class EditorManager<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  private readonly _column: Column<TData>;

  public constructor(column: Column<TData>) {
    this._column = column;
  }

  private get column(): Column<TData> {
    return this._column;
  }

  private get classNamesMap(): ClassNamesMap {
    return this.column.editable.classNamesMap;
  }

  private get editorOptions(): IEditor {
    return defaultEditorOptions(this.column.editorOptions, this.column);
  }

  public generateEditorHTML(
    defaultValue?: HTMLElementWithValue['value'] | HTMLInputElement['valueAsNumber'],
  ): HTMLElementWithValue {
    console.log(this.editorOptions);
    switch (this.editorOptions.type) {
      case 'text':
        return this.generateTextAreaHTML(String(defaultValue ?? ''));
      case 'string':
        return this.generateTextInputHTML(String(defaultValue ?? ''));
      case 'number':
        return this.generateNumberInputHTML(Number(defaultValue ?? 0));
      case 'money':
        return this.generateMoneyInputHTML(Number(defaultValue ?? 0));
      case 'money-3':
        return this.generateMoney3InputHTML(Number(defaultValue ?? 0));
      case 'email':
        return this.generateEmailInputHTML(String(defaultValue ?? ''));
      case 'list-stc':
        return this.generateListStcSelectHTML(this.column.listStcData, this.column.field);
      default:
        throw new TypeError('Invalid editor type.');
    }
  }

  public checkValidity(element: HTMLElementWithValue): boolean {
    return element.checkValidity();
  }

  public static isHTMLElementWithValue(element: Element): element is HTMLElementWithValue {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    );
  }

  private generateTextAreaHTML(
    defaultValue: HTMLTextAreaElement['value'] = '',
  ): HTMLTextAreaElement {
    if (!isIEditorString(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('textarea') ?? 'form-control form-control-sm';

    const textArea = document.createElement('textarea');
    textArea.className = className;
    textArea.placeholder = this.column.field;
    textArea.value = defaultValue;
    textArea.required = this.editorOptions.required ?? true;
    textArea.disabled = this.editorOptions.disabled ?? false;
    textArea.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.maxLength
      ? (textArea.maxLength = this.editorOptions.maxLength)
      : undefined;

    return fragment.appendChild(textArea);
  }

  private generateTextInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    if (!isIEditorString(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-string') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.placeholder = this.column.field;
    input.type = 'string';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;
    this.editorOptions.maxLength
      ? (input.maxLength = this.editorOptions.maxLength)
      : undefined;

    return fragment.appendChild(input);
  }

  private generateEmailInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    if (!isIEditorString(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-email') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'email';
    input.placeholder = this.column.field;
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;
    this.editorOptions.maxLength
      ? (input.maxLength = this.editorOptions.maxLength)
      : undefined;

    return fragment.appendChild(input);
  }

  private generateNumberInputHTML(
    defaultValue: HTMLInputElement['valueAsNumber'] = 0,
  ): HTMLInputElement {
    if (!isIEditorNumber(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-num') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'number';
    input.placeholder = this.column.field;
    input.valueAsNumber = defaultValue;
    this.editorOptions.step ? (input.step = this.editorOptions.step) : undefined;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.min ? (input.min = this.editorOptions.min) : undefined;
    this.editorOptions.max ? (input.max = this.editorOptions.max) : undefined;

    return fragment.appendChild(input);
  }

  private generateMoneyInputHTML(
    defaultValue: HTMLInputElement['valueAsNumber'] = 0,
  ): HTMLInputElement {
    if (!isIEditorNumber(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-num') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.setAttribute('name', 'inp-money');
    input.className = className;
    input.type = 'number';
    input.placeholder = this.column.field;
    input.valueAsNumber = parseFloat(formatNumber(defaultValue, 2, '.', ' '));
    input.step = this.editorOptions.step ?? '0.01';
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.min ? (input.min = this.editorOptions.min) : undefined;
    this.editorOptions.max ? (input.max = this.editorOptions.max) : undefined;

    return fragment.appendChild(input);
  }

  private generateMoney3InputHTML(
    defaultValue: HTMLInputElement['valueAsNumber'] = 0,
  ): HTMLInputElement {
    if (!isIEditorNumber(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-num') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.setAttribute('name', 'inp-money-3');
    input.className = className;
    input.type = 'number';
    input.placeholder = this.column.field;
    input.valueAsNumber = parseFloat(formatNumber(defaultValue, 3, '.', ' '));
    input.step = this.editorOptions.step ?? '0.001';
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.min ? (input.min = this.editorOptions.min) : undefined;
    this.editorOptions.max ? (input.max = this.editorOptions.max) : undefined;

    return fragment.appendChild(input);
  }

  private generateListStcSelectHTML(
    data: Record<string, unknown>[],
    field: string,
  ): HTMLSelectElement {
    if (!isIEditorListStc(this.editorOptions))
      throw new TypeError('The `editor` property passed does not follow the correct schema.');

    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('sel') ?? 'form-select form-select-sm';

    const select = document.createElement('select');
    select.setAttribute('name', 'list-stc');
    select.className = className;
    select.required = this.editorOptions.required ?? true;
    select.disabled = this.editorOptions.disabled ?? false;

    for (const obj of data)
      for (const [key, value] of Object.entries(obj))
        select.add(new Option(String(value), key, key === field, key === field));

    return fragment.appendChild(select);
  }
}
