import type { IEditor, HTMLElementWithValue } from './types';

export default class EditorManager {
  private readonly _editorOptions: IEditor;

  public constructor(editorOptions: IEditor) {
    this._editorOptions = editorOptions;
  }

  private get editorOptions(): IEditor {
    return this._editorOptions;
  }

  public generateEditorHTML(
    defaultValue: HTMLElementWithValue['value'],
  ): HTMLElementWithValue {
    switch (this.editorOptions.type) {
      case 'text':
        return this.generateTextAreaHTML(defaultValue);
      case 'string':
        return this.generateTextInputHTML(defaultValue);
      case 'number':
        return this.generateNumberInputHTML(defaultValue);
      default:
        throw new TypeError('Invalid editor type.');
    }
  }

  private generateTextAreaHTML(
    defaultValue: HTMLTextAreaElement['value'] = '',
  ): HTMLTextAreaElement {
    const fragment = document.createDocumentFragment();

    const textArea = document.createElement('textarea');
    textArea.value = defaultValue;
    textArea.required = this.editorOptions.required ?? true;
    textArea.disabled = this.editorOptions.disabled ?? false;
    textArea.readOnly = this.editorOptions.disabled ?? false;

    return fragment.appendChild(textArea);
  }

  private generateTextInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    const fragment = document.createDocumentFragment();

    const input = document.createElement('input');
    input.type = 'string';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    input.pattern = this.editorOptions.pattern ?? '';

    return fragment.appendChild(input);
  }

  private generateNumberInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    const fragment = document.createDocumentFragment();

    const input = document.createElement('input');
    input.type = 'string';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    input.pattern = this.editorOptions.pattern ?? '';

    return fragment.appendChild(input);
  }
}
