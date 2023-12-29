import type Column from './';
import type { IEditor, HTMLElementWithValue } from './types';
import type { ClassNamesMap } from '@/editable/types';
import type { JSONValues } from '../types';

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
    return (
      this.column.editorOptions ??
      ({
        type: 'string',
        required: true,
        disabled: false,
      } as const)
    );
  }

  public generateEditorHTML(
    defaultValue?: HTMLElementWithValue['value'] | HTMLInputElement['valueAsNumber'],
  ): HTMLElementWithValue {
    switch (this.editorOptions.type) {
      case 'text':
        return this.generateTextAreaHTML(String(defaultValue ?? ''));
      case 'string':
        return this.generateTextInputHTML(String(defaultValue ?? ''));
      case 'number':
        return this.generateNumberInputHTML(Number(defaultValue ?? 0));
      case 'email':
        return this.generateEmailInputHTML(String(defaultValue ?? ''));
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
    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('textarea') ?? 'form-control form-control-sm';

    const textArea = document.createElement('textarea');
    textArea.className = className;
    textArea.placeholder = this.column.field;
    textArea.value = defaultValue;
    textArea.required = this.editorOptions.required ?? true;
    textArea.disabled = this.editorOptions.disabled ?? false;
    textArea.readOnly = this.editorOptions.disabled ?? false;

    return fragment.appendChild(textArea);
  }

  private generateTextInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
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

    return fragment.appendChild(input);
  }

  private generateNumberInputHTML(
    defaultValue: HTMLInputElement['valueAsNumber'] = 0,
  ): HTMLInputElement {
    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-num') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'number';
    input.placeholder = this.column.field;
    input.valueAsNumber = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;

    return fragment.appendChild(input);
  }

  private generateEmailInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
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

    return fragment.appendChild(input);
  }
}
