import type { ColumnType, ColumnField, IDataOptions, IEditor } from './types';
import type { Options, IconSrc } from '../editable/types';
import type { ConfigColumns } from 'datatables.net-bs5';
import FieldManager from './fieldManager';

export default class Column {
  private _dataOptions!: IDataOptions;
  private readonly _editableOptions: Options;

  public constructor(dataOptionsStr: DOMStringMap[string], editableOptions: Options) {
    this.dataOptions = dataOptionsStr;
    this._editableOptions = editableOptions;
  }

  private get dataOptions(): IDataOptions {
    return this._dataOptions;
  }

  public get field(): ColumnField {
    return this.dataOptions.field;
  }

  private get type(): ColumnType | undefined {
    return this.dataOptions.type;
  }

  private get editableOptions(): Options {
    return this._editableOptions;
  }

  private get iconSrc(): IconSrc {
    return this.editableOptions.iconSrc ?? 'fa';
  }

  public get editorOptions(): IEditor | undefined {
    return this.dataOptions.editor;
  }

  public get submittable(): boolean {
    return this.dataOptions.submittable ?? true;
  }

  private set dataOptions(dataOptionsStr: DOMStringMap[string]) {
    let dataOptions = this.parseDataOptionsStr(dataOptionsStr);

    if (!this.validateDataOptions(dataOptions))
      throw new TypeError('The [data-options] passed does not follow the correct structure.');

    if (dataOptions.editor && !dataOptions.editor.type)
      dataOptions = {
        ...dataOptions,
        editor: {
          type: 'text',
        },
      };

    if (dataOptions.submittable === undefined)
      dataOptions = {
        ...dataOptions,
        submittable: true,
      };

    this._dataOptions = dataOptions;
  }

  private validateDataOptions(dataOptions: unknown): dataOptions is IDataOptions {
    return (
      typeof dataOptions !== 'undefined' &&
      dataOptions !== null &&
      !(dataOptions instanceof Function) &&
      !Array.isArray(dataOptions) &&
      typeof dataOptions === 'object' &&
      'field' in dataOptions
    );
  }

  private parseDataOptionsStr(dataOptionsStr: DOMStringMap[string]): IDataOptions {
    if (!dataOptionsStr)
      throw new TypeError('Expected a [data-options] attribute instead received undefined.');

    return JSON.parse(dataOptionsStr) as IDataOptions;
  }

  public generateConfigColumns(): ConfigColumns {
    switch (this.field) {
      case 'checkbox':
        return {
          data: null,
          render: (_data, _type, _row, { row }): HTMLDivElement['outerHTML'] => {
            const fieldManager = new FieldManager(this.field, row, this.iconSrc);
            return fieldManager.generateCheckboxHTML().outerHTML;
          },
          type: 'html',
          orderable: false,
        };
      case 'edit':
        return {
          data: null,
          render: (_data, _type, _row, { row }): HTMLSpanElement['outerHTML'] => {
            const fieldManager = new FieldManager(this.field, row, this.iconSrc);
            return fieldManager.generateEditHTML().outerHTML;
          },
          type: 'html',
          orderable: false,
        };
      case 'delete':
        return {
          data: null,
          render: (_data, _type, _row, { row }): HTMLSpanElement['outerHTML'] => {
            const fieldManager = new FieldManager(this.field, row, this.iconSrc);
            return fieldManager.generateDeleteHTML().outerHTML;
          },
          type: 'html',
          orderable: false,
        };
      default:
        return {
          data: this.field,
          type: this.type,
          orderable: true,
        };
    }
  }
}
