import HtmlElementBase from '../base';
import type { Options } from './types/options';

export default class Icon extends HtmlElementBase {
  public constructor(private readonly options: Options) {
    super();
  }

  public get icon(): HTMLElement['className'] {
    return this.options.icon;
  }

  public get id(): HTMLSpanElement['id'] {
    return this.options.id;
  }

  public get name(): string | undefined {
    return this.options.name;
  }

  public get className(): HTMLSpanElement['className'] | undefined {
    return this.options.className;
  }

  public generateHtml(): HTMLSpanElement {
    const fragment = document.createDocumentFragment();

    const span = document.createElement('span');
    span.role = 'button';
    span.id = this.id;
    if (this.name) span.setAttribute('name', this.name);
    if (this.className) span.className = this.className;

    const icon = document.createElement('i');
    icon.role = 'button';
    icon.className = this.icon;
    if (this.name) icon.setAttribute('name', this.name);

    span.appendChild(icon);

    return fragment.appendChild(span);
  }
}
