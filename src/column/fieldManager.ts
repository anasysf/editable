import type { ColumnField } from './types';
import type { IconSrcMap, IconSrc } from '../editable/types';

export default class FieldManager {
  private readonly _field: ColumnField;
  private readonly _rowIdx: number;
  private static _iconSrcMap: IconSrcMap = new Map();
  private readonly _iconSrc: IconSrc = 'fa';

  public constructor(field: ColumnField, rowIdx: number, iconSrc: IconSrc = 'fa') {
    this._field = field;
    this._rowIdx = rowIdx;
    this._iconSrc = iconSrc;

    FieldManager._iconSrcMap = new Map([
      [
        'fa',
        {
          delete: 'fa-regular fa-trash-can text-danger',
          edit: 'fa-regular fa-pen-to-square text-primary',
          'save-row-edit': 'fa-solid fa-check text-success',
          'cancel-row-edit': 'fa-solid fa-xmark text-danger',
          'save-new-row': 'fa-solid fa-check text-success',
          'cancel-new-row': 'fa-solid fa-xmark text-danger',
        },
      ],
    ]);
  }

  public get field(): ColumnField {
    return this._field;
  }

  public get rowIdx(): number {
    return this._rowIdx;
  }

  public get iconSrc(): IconSrc {
    return this._iconSrc;
  }

  public static get iconSrcMap(): IconSrcMap {
    return this._iconSrcMap;
  }

  public generateCheckboxHTML(): HTMLDivElement {
    const fragment = document.createDocumentFragment();
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.id = `check-wrapper-${this.field}-${this.rowIdx}`;
    checkboxWrapper.className = 'form-check';

    const input = document.createElement('input');
    input.id = `check-${this.field}-${this.rowIdx}`;
    input.className = 'form-check-input';
    input.name = `check-${this.field}-${this.rowIdx}`;
    input.type = 'checkbox';

    checkboxWrapper.appendChild(input);

    return fragment.appendChild(checkboxWrapper);
  }

  public generateEditHTML(): HTMLSpanElement {
    const iconSrcMap = FieldManager.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new SyntaxError(`Expected a valid 'iconSrc' instead received: ${this.iconSrc}.`);

    const fragment = document.createDocumentFragment();
    const iconWrapper = document.createElement('span');
    iconWrapper.id = `${this.field}-row-icon-wrapper-${this.rowIdx}`;
    iconWrapper.setAttribute('name', 'edit-row-icon');
    iconWrapper.title = 'Modifier';
    iconWrapper.role = 'button';

    const icon = document.createElement('i');
    icon.id = `${this.field}-row-icon-${this.rowIdx}`;
    icon.setAttribute('name', 'edit-row-icon');
    icon.className = iconSrcMap.edit;
    icon.role = 'button';

    iconWrapper.appendChild(icon);

    return fragment.appendChild(iconWrapper);
  }

  public generateDeleteHTML(): HTMLSpanElement {
    const iconSrcMap = FieldManager.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new SyntaxError(`Expected a valid 'iconSrc' instead received: ${this.iconSrc}.`);

    const fragment = document.createDocumentFragment();
    const iconWrapper = document.createElement('span');
    iconWrapper.id = `${this.field}-row-icon-wrapper-${this.rowIdx}`;
    iconWrapper.setAttribute('name', 'delete-row-icon');
    iconWrapper.title = 'Supprimer';
    iconWrapper.role = 'button';

    const icon = document.createElement('i');
    icon.id = `${this.field}-row-icon-${this.rowIdx}`;
    icon.setAttribute('name', 'delete-row-icon');
    icon.className = iconSrcMap.delete;
    icon.role = 'button';

    iconWrapper.appendChild(icon);

    return fragment.appendChild(iconWrapper);
  }

  public static toggleIcon(
    target: EventTarget | HTMLElement,
    id: HTMLElement['id'],
    title: HTMLElement['title'],
    rowIdx: number,
    className: HTMLElement['className'],
  ): void {
    const fragment = document.createDocumentFragment();

    const iconWrapper = this.generateIconWrapperBtn(id, title, rowIdx);
    const icon = this.generateIconBtn(id, title, rowIdx, className);

    iconWrapper.appendChild(icon);
    fragment.appendChild(iconWrapper);

    if (target instanceof HTMLSpanElement) {
      target.replaceWith(fragment);
    } else {
      const span = (target as HTMLElement).closest('span');
      if (!span) throw new ReferenceError('Could not find a <span> element.');

      span.replaceWith(fragment);
    }
  }

  private static generateIconWrapperBtn(
    id: HTMLSpanElement['id'],
    title: HTMLSpanElement['title'],
    rowIdx: number,
  ): HTMLSpanElement {
    const iconWrapper = document.createElement('span');
    iconWrapper.id = `${id}-icon-wrapper-${rowIdx}`;
    iconWrapper.setAttribute('name', `${id}-icon`);
    iconWrapper.title = title;
    iconWrapper.role = 'button';

    return iconWrapper;
  }

  private static generateIconBtn(
    id: HTMLElement['id'],
    title: HTMLElement['title'],
    rowIdx: number,
    className: HTMLElement['className'],
  ): HTMLElement {
    const icon = document.createElement('i');
    icon.id = `${id}-icon-${rowIdx}`;
    icon.setAttribute('name', `${id}-icon`);
    icon.className = className;
    icon.title = title;
    icon.role = 'button';

    return icon;
  }
}
