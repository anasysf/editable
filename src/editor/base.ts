import type { HTMLElementsWithValue } from '../types';
import type { EditorType } from './types/options';

export default abstract class BaseEditor<
  T extends keyof EditorType,
  E extends HTMLElementsWithValue = EditorType[T],
> {
  protected readonly _type: T;
  protected readonly _fragment: DocumentFragment;
  protected readonly _element: E;

  protected constructor(type: T, fragment: DocumentFragment, element: E) {
    this._type = type;
    this._fragment = fragment;
    this._element = element;
  }

  protected get type(): T {
    return this._type;
  }

  public get element(): E {
    return this._element;
  }

  public abstract generateHTML(fieldName: string, rowIdx: number, defaultValue: E['value']): E;
}
