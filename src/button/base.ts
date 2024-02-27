import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../editable';
import type { IconMap, IconSrc } from '../editable/types/options/iconMap';
import type { JsonValue } from '../types';
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

  public abstract generateHtml<T extends Record<string, JsonValue>>(
    row: ApiRowMethods<T>,
    editable: Editable<T, boolean | undefined>,
  ): HTMLSpanElement;

  public abstract onClick<T extends Record<string, JsonValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<T>,
    oldRowData: T,
    editable: Editable<T, boolean | undefined>,
  ): void;
}
