import type { HTMLElementsWithValue } from '../../types';

export default abstract class HTMLElementBase {
  private _element!: HTMLElementsWithValue;

  public get element(): HTMLElementsWithValue {
    return this._element;
  }

  protected set element(element: HTMLElementsWithValue) {
    this._element = element;
  }

  protected abstract generateHTML(): HTMLElement;

  public validate(): boolean {
    return this.element.checkValidity();
  }
}
