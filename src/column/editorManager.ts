import type { IEditor, HTMLElementWithValue } from './types';
import type { Options, ClassNamesMap, ClassNames } from '@/editable/types';

export default class EditorManager {
  private readonly _editorOptions: IEditor;
  private readonly _editableOptions: Options;
  private readonly _classNamesMap: ClassNamesMap = new Map();

  public constructor(editorOptions: IEditor, editableOptions: Options) {
    this._editorOptions = editorOptions;
    this._editableOptions = editableOptions;

    this._classNamesMap = new Map(
      Object.entries(this.editableOptions.classNamesMap ?? {}) as [
        ClassNames,
        HTMLElement['innerHTML'],
      ][],
    );
  }

  private get editorOptions(): IEditor {
    return this._editorOptions;
  }

  private get editableOptions(): Options {
    return this._editableOptions;
  }

  private get classNamesMap(): ClassNamesMap {
    return this._classNamesMap;
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
      case 'email':
        return this.generateEmailInputHTML(defaultValue);
      default:
        throw new TypeError('Invalid editor type.');
    }
  }

  private generateTextAreaHTML(
    defaultValue: HTMLTextAreaElement['value'] = '',
  ): HTMLTextAreaElement {
    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('textarea') ?? 'form-control form-control-sm';

    const textArea = document.createElement('textarea');
    textArea.className = className;
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
    const className = this.classNamesMap.get('inp-string') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'string';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;

    return fragment.appendChild(input);
  }

  private generateNumberInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-num') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'string';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;

    return fragment.appendChild(input);
  }

  private generateEmailInputHTML(
    defaultValue: HTMLInputElement['value'] = '',
  ): HTMLInputElement {
    const fragment = document.createDocumentFragment();
    const className = this.classNamesMap.get('inp-email') ?? 'form-control form-control-sm';

    const input = document.createElement('input');
    input.className = className;
    input.type = 'email';
    input.value = defaultValue;
    input.required = this.editorOptions.required ?? true;
    input.disabled = this.editorOptions.disabled ?? false;
    input.readOnly = this.editorOptions.disabled ?? false;
    this.editorOptions.pattern ? (input.pattern = this.editorOptions.pattern) : undefined;

    return fragment.appendChild(input);
  }
}
