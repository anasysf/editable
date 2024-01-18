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
import StringInput from '../utils/html-elements/string-input';
import NumberInput from '../utils/html-elements/number-input';
import type { HTMLElementsWithValue, HTMLInputs } from '../types';

export default class Editor<T extends EditorType> {
  private readonly _options: NormalizedOptions<T>;

  public constructor(options: Options<T>) {
    const opts = defaultOptions(options);

    this._options = opts;
  }

  public get options(): NormalizedOptions<T> {
    return this._options;
  }

  public get type(): T {
    return this.options.type;
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

  public generateHTML(fieldName: string, rowIdx: number): HTMLElementsWithValue {
    switch (this.type) {
      case 'string':
        return this.generateStringInputHTML(fieldName, rowIdx);
      case 'number':
        return this.generateNumberInputHTML(fieldName, rowIdx);
      default:
        throw new TypeError(`The editor type passed: ${this.type} is not a valid type.`);
    }
  }

  private generateStringInputHTML(fieldName: string, rowIdx: number): HTMLInputElement {
    const input = new StringInput({
      id: `edit-${fieldName}-inp-${rowIdx}`,
      required: this.required,
      readonly: this.readonly,
      disabled: this.disabled,
      minLength: this.minLength,
      maxLength: this.maxLength,
      pattern: this.pattern,
    });

    return input.generateHTML();
  }

  private generateNumberInputHTML(fieldName: string, rowIdx: number): HTMLInputElement {
    const input = new NumberInput({
      id: `edit-${fieldName}-inp-${rowIdx}`,
      required: this.required,
      readonly: this.readonly,
      disabled: this.disabled,
      min: this.min,
      max: this.max,
      step: this.step,
    });

    return input.generateHTML();
  }
}
