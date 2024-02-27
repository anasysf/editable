import type { HtmlElementsWithValue } from '../../types';

export default abstract class HtmlElementBase {
  public element!: HtmlElementsWithValue;

  public validate(): boolean {
    return this.element.checkValidity();
  }

  protected abstract generateHtml(): HTMLElement;
}
