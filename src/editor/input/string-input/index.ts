import BaseEditor from '../../base';
import { defaultOptions } from './defaults';
import type { NormalizedStringOptions, StringOptions } from './types';

export default class StringInput extends BaseEditor<'string'> {
  private readonly _options: NormalizedStringOptions;

  public constructor(options?: StringOptions) {
    const opts = defaultOptions(options);

    super('string', new DocumentFragment(), document.createElement('input'));

    this._options = opts;
  }

  public generateHTML(
    fieldName: string,
    defaultValue: HTMLInputElement['value'],
    rowIdx?: number,
    editMode: boolean = true,
  ): HTMLInputElement {
    const input = this.element;
    const options = this._options;

    input.type = this.type;
    input.id = editMode ? `edit-${fieldName}-inp-${rowIdx}` : `add-new-row-${fieldName}-inp`;
    input.name = editMode ? 'edit-row-inp' : 'add-new-row-inp';
    input.className = options.className ?? 'form-control form-control-sm';
    input.required = options.required;
    input.readOnly = options.readonly;
    input.disabled = options.disabled;
    options.minLength && (input.minLength = options.minLength);
    options.maxLength && (input.maxLength = options.maxLength);
    options.pattern && (input.pattern = options.pattern);
    input.placeholder = fieldName;
    input.defaultValue = defaultValue;

    return this.fragment.appendChild(input);
  }
}
