import type { JSONValue } from '../types';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../editable';
import type { IconSrc, IconMap } from '../editable/types/options/iconMap';
import type { ButtonTypeIconMap } from './types';

export default abstract class IconButtonBase<T extends ButtonTypeIconMap> {
  private readonly _type: T;

  protected constructor(type: T) {
    this._type = type;
  }

  public get type(): T {
    return this._type;
  }

  public getIconByType(iconSrc: IconSrc, iconMap: IconMap): string | undefined {
    return iconMap[iconSrc][this.type];
  }

  public abstract generateHTML<TData extends Record<string, JSONValue>>(
    row: ApiRowMethods<TData>,
    editable: Editable<TData, boolean | undefined>,
  ): HTMLSpanElement;

  public abstract onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    oldRowData: TData,
    editable: Editable<TData, boolean | undefined>,
  ): void;
}
