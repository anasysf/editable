import BaseEditor from '../../base';
import { defaultOptions } from './defaults';
import type { CheckboxOptions, NormalizedCheckboxOptions } from './types';

export default class Checkbox extends BaseEditor<'checkbox'> {
  public readonly options: NormalizedCheckboxOptions;

  public constructor(options: CheckboxOptions) {
    const opts = defaultOptions(options);

    super('checkbox', new DocumentFragment(), document.createElement('input'));

    this.options = opts;
  }

  public generateHtml(
    fieldName: string,
    defaultValue: HTMLInputElement['defaultChecked'],
    rowIdx?: number,
    editMode = true,
  ): HTMLInputElement {
    const input = this.element;
    const { options } = this;

    input.type = this.type;
    input.id = editMode ? `checkbox-${fieldName}-inp-${rowIdx}` : `checkbox-${fieldName}-inp`;
    input.name = 'checkbox-row-inp';
    input.className = options.className ?? 'form-check-input form-check-input-sm';
    input.required = options.required;
    input.readOnly = options.readonly;
    input.disabled = options.disabled;
    input.defaultChecked = defaultValue;

    return this.fragment.appendChild(input);
  }
}
