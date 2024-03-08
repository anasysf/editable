import BaseEditor from '../../base';
import { defaultOptions } from './defaults';
import { type NormalizedSelectOptions, type SelectOptions } from './types';

export default class SelectStatic extends BaseEditor<'select-static'> {
  public readonly options: NormalizedSelectOptions;

  public constructor(options: SelectOptions) {
    const opts = defaultOptions(options);

    super('select-static', new DocumentFragment(), document.createElement('select'));

    this.options = opts;
  }

  public generateHtml(
    fieldName: string,
    defaultValue: HTMLSelectElement['value'],
    rowIdx?: number,
    editMode = true,
  ): HTMLSelectElement {
    const select = this.element;

    select.id = editMode ? `edit-${fieldName}-sel-${rowIdx}` : `add-new-row-${fieldName}-sel`;
    select.name = editMode ? 'edit-row-sel' : 'add-new-row-sel';
    select.className = this.options.className ?? 'form-select form-select-sm';
    select.required = this.options.required;
    select.disabled = this.options.disabled;

    // WARNING: THIS IS A HACK AND MUST BE CHANGED LATER.
    // BUT FOR NOW DO NOT TOUCH!!!!!
    while (select.options.length) select.remove(0);

    const { id } = this.options;
    for (const data of this.options.data)
      for (const [key, value] of Object.entries(data))
        if (key !== id)
          select.options.add(
            new Option(
              String(value),
              String(data[this.options.id]),
              value === defaultValue,
              value === defaultValue,
            ),
          );

    /* For (const [key, value] of Object.entries(currentObj)) {
      if (key === prop) select.options.add(new Option(defaultValue, defaultValue, true, true));
      else select.options.add(new Option(value as string, value as string));
    } */

    /* Const selectedOption = new Option(defaultValue, defaultValue, true, true);
      select.options.add(selectedOption); */
    // }

    return this.fragment.appendChild(select);
  }
}
