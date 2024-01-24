import HTMLElementBase from '../base';
import type { Options } from './types/options';

export default class Icon extends HTMLElementBase {
  private readonly _options: Options;

  public constructor(options: Options) {
    super();

    this._options = options;
  }

  public get options(): Options {
    return this._options;
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

  public generateHTML(): HTMLSpanElement {
    const fragment = document.createDocumentFragment();

    const span = document.createElement('span');
    span.role = 'button';
    this.id && (span.id = this.id);
    this.name && span.setAttribute('name', this.name);
    this.className && (span.className = this.className);

    const icon = document.createElement('i');
    icon.role = 'button';
    icon.className = this.icon;
    this.name && icon.setAttribute('name', this.name);

    span.appendChild(icon);

    return fragment.appendChild(span);
  }
}
