import type { ColumnField } from './types';
import type { JSONValues } from '@/types';
import type Column from '.';
import type { IconSrcMap, IconSrc } from '@/editable/types';
import type Editable from '@/editable';
import HTTP from '@/http';

export default class FieldManager<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  private readonly _column: Column<TData>;
  private readonly _editable: Editable<TData>;
  private readonly _rowIdx: number;

  public constructor(column: Column<TData>, editable: Editable<TData>, rowIdx: number) {
    this._column = column;
    this._editable = editable;
    this._rowIdx = rowIdx;
  }

  private get column(): Column<TData> {
    return this._column;
  }

  private get editable(): Editable<TData> {
    return this._editable;
  }

  private get field(): ColumnField {
    return this.column.field;
  }

  private get rowIdx(): number {
    return this._rowIdx;
  }

  private get iconSrc(): IconSrc {
    return this.editable.iconSrc;
  }

  private get iconSrcMap(): IconSrcMap {
    return this.editable.iconSrcMap;
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
    const iconSrcMap = this.iconSrcMap.get(this.iconSrc);
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
    const iconSrcMap = this.iconSrcMap.get(this.iconSrc);
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

  public retrieveListData<T extends Record<string, JSONValues>[]>(list: T): unknown[] {
    const data: unknown[] = [];

    list.forEach((val) => {
      if (!(this.field in val)) throw new ReferenceError(`Could not find ${this.field}.`);

      data.push(val[this.field]);
    });

    return data;
  }

  public async getListDynData<T extends Record<string, JSONValues>[]>(): Promise<T> {
    const http = new HTTP(this.column.listDynSrc);

    const list = await http.send<T>({ method: 'GET' });
    if (!Array.isArray(list))
      throw new TypeError('The return type of the `list-dyn` is not an array.');

    return list;
  }
}
