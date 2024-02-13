import type { HTMLElementsWithValue } from '../types';
import type { EditorType } from './types/options';

export default abstract class BaseEditor<
  T extends keyof EditorType,
  E extends HTMLElementsWithValue = EditorType[T],
> {
  public readonly type: T;
  public readonly fragment: DocumentFragment;
  public readonly element: E;

  protected constructor(type: T, fragment: DocumentFragment, element: E) {
    this.type = type;
    this.fragment = fragment;
    this.element = element;
  }

  public validateElement(): boolean {
    return this.element.checkValidity();
  }

  public abstract generateHTML(fieldName: string, rowIdx: number, defaultValue: E['value']): E;
}
