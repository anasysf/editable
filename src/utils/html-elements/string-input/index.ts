import type { Options } from './types/options';
import HTMLElementBase from '../base';

export default class StringInput extends HTMLElementBase {
  private readonly _options: Options;

  public constructor(options: Options) {
    super();

    this._options = options;
  }

  public get options(): Options {
    return this._options;
  }

  public get id(): HTMLInputElement['id'] | undefined {
    return this.options.id;
  }

  public get name(): HTMLInputElement['name'] | undefined {
    return this.options.name;
  }

  public get className(): HTMLInputElement['className'] | undefined {
    return this.options.className;
  }

  public get required(): HTMLInputElement['required'] | undefined {
    return this.options.required;
  }

  public get readonly(): HTMLInputElement['readOnly'] | undefined {
    return this.options.readonly;
  }

  public get disabled(): HTMLInputElement['disabled'] | undefined {
    return this.options.disabled;
  }

  public get minLength(): HTMLInputElement['minLength'] | undefined {
    return this.options.minLength;
  }

  public get maxLength(): HTMLInputElement['maxLength'] | undefined {
    return this.options.maxLength;
  }

  public get pattern(): HTMLInputElement['pattern'] | undefined {
    return this.options.pattern;
  }

  public generateHTML(): HTMLInputElement {
    const fragment = document.createDocumentFragment();

    const input = document.createElement('input');

    input.type = 'text';
    this.id && (input.id = this.id);
    this.name && (input.name = this.name);
    this.className && (input.className = this.className);
    this.required && (input.required = this.required);
    this.readonly && (input.readOnly = this.readonly);
    this.disabled && (input.disabled = this.disabled);
    this.minLength && (input.minLength = this.minLength);
    this.maxLength && (input.maxLength = this.maxLength);
    this.pattern && (input.pattern = this.pattern);

    return fragment.appendChild(input);
  }
}
