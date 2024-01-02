import type { ColumnType, ColumnField, IDataOptions, IEditor } from './types';
import type Editable from '@/editable';
import type { Options, IconSrc } from '@/editable/types';
import type { ConfigColumns } from 'datatables.net-bs5';
import type { JSONValues } from '@/types';
import FieldManager from './fieldManager';
import EditorManager from './editorManager';
import { formatNumber } from '@utils';

export default class Column<TData extends Record<string, JSONValues> = Record<string, never>> {
  private _dataOptions!: IDataOptions;
  private readonly _editable: Editable<TData>;

  public constructor(dataOptionsStr: DOMStringMap[string], editable: Editable<TData>) {
    this.dataOptions = dataOptionsStr;
    this._editable = editable;
  }

  private get dataOptions(): IDataOptions {
    return this._dataOptions;
  }

  public get editable(): Editable<TData> {
    return this._editable;
  }

  public get field(): ColumnField {
    return this.dataOptions.field;
  }

  public get type(): ColumnType | undefined {
    return this.dataOptions.type;
  }

  private get editableOptions(): Options {
    return this.editable.options;
  }

  private get iconSrc(): IconSrc {
    return this.editableOptions.iconSrc;
  }

  public get editorOptions(): IEditor | undefined {
    return this.dataOptions.editor;
  }

  public get submittable(): boolean {
    return this.dataOptions.submittable ?? true;
  }

  public get isEditable(): boolean {
    return this.editorOptions !== undefined;
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
        if (!this.editable.isEditable)
          throw new SyntaxError("Can't have an `edit` column on a non-editable <table>.");

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
        if (this.type === 'money' || this.type === 'money-3')
          return {
            data: this.field,
            render: (data): HTMLTableCellElement['innerHTML'] => {
              if (data instanceof Function) {
                const editorManager = new EditorManager(this);
                const editor = editorManager.generateEditorHTML(
                  formatNumber(0, this.type === 'money' ? 2 : 3, '.', ' '),
                ) as HTMLInputElement;

                return editor.outerHTML;
              }

              return formatNumber(data, this.type === 'money' ? 2 : 3, '.', ' ');
            },
            type: 'num',
            orderable: true,
          };

        return {
          data: this.field,
          type: this.type,
          orderable: true,
        };
    }
  }
}
