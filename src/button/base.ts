import type { JSONValue } from '../types';
import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '../editable';

export default abstract class ButtonBase {
  public abstract generateHTML<TData extends Record<string, JSONValue>>(
    row: ApiRowMethods<TData>,
    icon: HTMLElement['className'],
  ): HTMLSpanElement;

  public abstract onClick<TData extends Record<string, JSONValue>>(
    evt: MouseEvent,
    row: ApiRowMethods<TData>,
    editable: Editable<TData>,
  ): void;
}
