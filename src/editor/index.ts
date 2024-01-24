import type {
  EditorType,
  Options,
  NormalizedOptions,
  StringOptions,
  NumberOptions,
  StringEditorType,
  NumberEditorType,
} from './types/options';
import { defaultOptions } from './defaults/options';
import type { HTMLElementsWithValue, HTMLInputs } from '../types';

export default class Editor<T extends EditorType> {
  private readonly _options: NormalizedOptions<T>;
  private _element!: HTMLElementsWithValue;

  public constructor(options: Options<T>) {
    const opts = defaultOptions(options);

    this._options = opts;
  }

  public get options(): NormalizedOptions<T> {
    return this._options;
  }

  public get element(): HTMLElementsWithValue {
    return this._element;
  }

  public set element(element: HTMLElementsWithValue) {
    this._element = element;
  }

  public get value(): HTMLElementsWithValue['value'] {
    return this.element.value;
  }

  public set value(value: HTMLElementsWithValue['value']) {
    this.element.value = value;
  }

  public get type(): T {
    return this.options.type;
  }

  public get className(): HTMLElementsWithValue['className'] | undefined {
    return this.options.className;
  }

  public get required(): HTMLElementsWithValue['required'] {
    return this.options.required;
  }

  public get readonly(): HTMLInputs['readOnly'] {
    return this.options.readonly;
  }

  public get disabled(): HTMLElementsWithValue['disabled'] {
    return this.options.disabled;
  }

  public get minLength(): HTMLInputElement['minLength'] | undefined {
    return (this.options as StringOptions<Extract<T, StringEditorType>>).minLength;
  }

  public get maxLength(): HTMLInputElement['maxLength'] | undefined {
    return (this.options as StringOptions<Extract<T, StringEditorType>>).maxLength;
  }

  public get pattern(): HTMLInputElement['pattern'] | undefined {
    return (this.options as StringOptions<Extract<T, StringEditorType>>).pattern;
  }

  public get min(): HTMLInputElement['min'] | undefined {
    return (this.options as NumberOptions<Extract<T, NumberEditorType>>).min;
  }

  public get max(): HTMLInputElement['max'] | undefined {
    return (this.options as NumberOptions<Extract<T, NumberEditorType>>).max;
  }

  public get step(): HTMLInputElement['step'] | undefined {
    return (this.options as NumberOptions<Extract<T, NumberEditorType>>).step;
  }

  public generateHTML(
    fieldName: string,
    rowIdx: number,
    defaultValue: HTMLElementsWithValue['value'],
  ): HTMLElementsWithValue {
    switch (this.type) {
      case 'string':
        return this.generateStringInputHTML(fieldName, rowIdx, defaultValue);
      case 'number':
        return this.generateNumberInputHTML(fieldName, rowIdx);
      default:
        throw new TypeError(`The editor type passed: ${this.type} is not a valid type.`);
    }
  }

  public validate(): boolean {
    return this.element.checkValidity();
  }

  private generateStringInputHTML(
    fieldName: string,
    rowIdx: number,
    defaultValue: HTMLInputElement['value'],
  ): HTMLInputElement {
    const fragment = new DocumentFragment();

    const input = document.createElement('input');

    input.type = 'text';
    input.id = `edit-${fieldName}-inp-${rowIdx}`;
    input.name = 'edit-row-inp';
    input.className = this.className ?? 'form-control form-control-sm';
    this.required && (input.required = this.required);
    this.readonly && (input.readOnly = this.readonly);
    this.disabled && (input.disabled = this.disabled);
    this.minLength && (input.minLength = this.minLength);
    this.maxLength && (input.maxLength = this.maxLength);
    this.pattern && (input.pattern = this.pattern);
    input.placeholder = fieldName;
    input.defaultValue = defaultValue;

    this.element = fragment.appendChild(input);
    return this.element;
  }

  private generateNumberInputHTML(fieldName: string, rowIdx: number): HTMLInputElement {
    const fragment = new DocumentFragment();

    const input = document.createElement('input');

    input.type = 'text';
    input.id = `edit-${fieldName}-inp-${rowIdx}`;
    input.name = 'edit-row-inp';
    input.className = this.className ?? 'form-control form-control-sm';
    this.required && (input.required = this.required);
    this.readonly && (input.readOnly = this.readonly);
    this.disabled && (input.disabled = this.disabled);
    this.min && (input.min = this.min);
    this.max && (input.max = this.max);
    this.step && (input.step = this.step);
    input.placeholder = fieldName;

    this.element = fragment.appendChild(input);
    return this.element;
  }
}
