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

  public abstract generateHTML(
    fieldName: string,
    defaultValue:
      | E['value']
      | HTMLInputElement['defaultChecked']
      | HTMLInputElement['valueAsNumber'],
    rowIdx?: number,
    editMode?: boolean,
  ): E;

  public getElementValue(): boolean | string | number {
    if (this.element instanceof HTMLInputElement) {
      switch (this.element.type) {
        case 'checkbox':
          return this.element.checked;
        case 'string':
          return this.element.value;
        case 'number':
          return this.element.valueAsNumber;
        default:
          return this.element.value;
      }
    }

    return this.element.value;
  }

  public setElementValue(newValue: boolean | string | number): void {
    if (this.element instanceof HTMLInputElement) {
      switch (this.element.type) {
        case 'checkbox':
          this.element.checked = Boolean(newValue);
          break;
        case 'string':
          this.element.value = String(newValue);
          break;
        case 'number':
          this.element.valueAsNumber = Number(newValue);
          break;
        default:
          this.element.value = String(newValue);
      }
    }

    this.element.value = String(newValue);
  }
}
