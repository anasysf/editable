import type { Api, ApiRowMethods, Config, ConfigColumns } from 'datatables.net-bs5';
import DataTable from 'datatables.net-bs5';
import type IconButtonBase from '../button/base';
import CancelButton from '../button/cancel-button';
import SubmitButton from '../button/submit-button';
import { ButtonTypeIconMap } from '../button/types';
import type BaseEditor from '../editor/base';
import type Checkbox from '../editor/input/checkbox';
import StringInput from '../editor/input/string-input';
import type { EditorType } from '../editor/types/options';
import { isHtmlElementsWithValue } from '../editor/utils/type-guard';
import type Field from '../field';
import type { FieldType } from '../field/types/options';
import type {
  HtmlElementsWithValue,
  HttpRequestFormat,
  JsonArray,
  JsonObject,
  JsonValue,
  TableId,
} from '../types';
import EventEmitter from '../utils/event-emitter';
import Http from '../utils/http';
import { isString } from '../utils/type-guard';
import { defaultConfig } from './defaults/config';
import { defaultOptions } from './defaults/options';
import { Events, type EventMap } from './types/events';
import type { NormalizedOptions, Options } from './types/options';
import type { DeleteDataSrc, DeleteDataSrcMethod } from './types/options/deleteDataSrc';
import type { IconMap, IconSrc } from './types/options/iconMap';
import type { PostDataSrcMethod, Response } from './types/options/postDataSrc';
import type { UpdateDataSrc, UpdateDataSrcMethod } from './types/options/updateDataSrc';
import { replaceDeleteIcon, replaceEditIcon } from './utils';
import { isCheckboxEditor, isEditableOptions } from './utils/type-guard';
import { validateTableElement } from './utils/validation';

/**
 * Class representing the Editable instance.
 * @typeParam TData - The type of the data in the Editable instance.
 */
export default class Editable<
  D extends Record<string, JsonValue>,
  E extends boolean | undefined = true,
> extends EventEmitter<EventMap> {
  /** The HTML Table element ID. */
  public readonly tableId: TableId;

  /** The HTML Table element. */
  public readonly table: HTMLTableElement;

  /** The Editable instance options. */
  public readonly options: NormalizedOptions<E>;

  /** The DataTable instance config. */
  public readonly config: Config;

  /**
   * The DataTable instance.
   * @typeParam TData - The data type.
   */
  public readonly dataTable: Api<D>;

  /**
   * Create a new Editable instance.
   * @param tableId - The Table element's ID that the instance attaches to.
   * @param options - The Editable instance's options.
   */
  public constructor(tableId: TableId, options: Options<E>) {
    // Validate the `tableId` & the element associated with it.
    const table = validateTableElement(tableId);

    // Get the default options.
    const opts = defaultOptions(options);

    super();

    // Set the tableId.
    this.tableId = tableId;

    // Set the table element.
    this.table = table;

    // Set the options.
    this.options = opts;

    // Generate the columns based on the fields passed in the options.
    const columns = this.generateConfigColumns();

    // Get the default DataTable config.
    const config = defaultConfig(options, columns);

    // Set the config.
    this.config = config;

    // Initiate the DataTables instance.
    this.dataTable = this.initDatatables(this.table, this.config);
  }

  public get isEditable(): boolean {
    return this.options.editable;
  }

  /**
   * Get the Editable instance's fields.
   *
   * @returns An array of the fields.
   */
  public get fields(): Array<Field<FieldType, keyof EditorType>> {
    return this.options.fields;
  }

  public get buttons(): Array<IconButtonBase<ButtonTypeIconMap>> | undefined {
    return this.options.buttons;
  }

  public get iconSrc(): IconSrc {
    return this.options.iconSrc;
  }

  public get iconMap(): IconMap {
    return this.options.iconMap;
  }

  public get updateDataSrc(): UpdateDataSrc | undefined {
    if (isEditableOptions(this.options)) return this.options.updateDataSrc;
    return undefined;
  }

  public get updateDataSrcSource(): string | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return this.updateDataSrc;
      else return this.updateDataSrc?.src;
    return undefined;
  }

  public get updateDataSrcMethod(): UpdateDataSrcMethod | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'PUT';
      else return this.updateDataSrc?.method ?? 'PUT';
    return undefined;
  }

  public get updateDataSrcFormat(): HttpRequestFormat | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'json';
      else return this.updateDataSrc?.format ?? 'json';
    return undefined;
  }

  public get updateDataSrcProp(): string | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'result.content';
      else return this.updateDataSrc?.prop ?? 'result.content';
    return undefined;
  }

  public get postDataSrcSource(): string | undefined {
    if (isString(this.options.postDataSrc)) return this.options.postDataSrc;
    return this.options.postDataSrc?.src;
  }

  public get potsDataSrcMethod(): PostDataSrcMethod | undefined {
    if (isString(this.options.postDataSrc)) return 'POST';
    return this.options.postDataSrc?.method ?? 'POST';
  }

  public get postDataSrcFormat(): HttpRequestFormat | undefined {
    if (isString(this.options.postDataSrc)) return 'json';
    return this.options.postDataSrc?.format ?? 'json';
  }

  public get deleteDataSrc(): DeleteDataSrc | undefined {
    return this.options.deleteDataSrc;
  }

  public get deleteDataSrcSource(): string | undefined {
    return isString(this.deleteDataSrc) ? this.deleteDataSrc : this.deleteDataSrc?.src;
  }

  public get deleteDataSrcMethod(): DeleteDataSrcMethod | undefined {
    return isString(this.deleteDataSrc) ? 'DELETE' : this.deleteDataSrc?.method ?? 'DELETE';
  }

  public get deleteDataSrcFormat(): HttpRequestFormat | undefined {
    return isString(this.deleteDataSrc) ? 'json' : this.deleteDataSrc?.format ?? 'json';
  }

  public addRow(): void {
    const getRowById = (row: HTMLTableRowElement): boolean => row.id === 'add-new-row';

    const newRowTr = Array.from(this.table.rows).find(getRowById);
    if (newRowTr) return;

    const editors: Record<string, string> = {};

    for (const field of this.fields) {
      const editor = field.options.editor ?? new StringInput();

      const editorHtml = editor.generateHtml(
        field.options.name,
        this.defaultEditorValue(editor),
        undefined,
        false,
      ).outerHTML as D[keyof D];

      editors[field.options.name] = editorHtml as string;
    }

    const newRow = this.dataTable.row.add(editors);

    const currentPageRows = this.dataTable.rows({ page: 'current' });
    const currentPageRowsNodes = currentPageRows.nodes().toArray() as HTMLTableRowElement[];
    const topPageRow = currentPageRowsNodes.at(0);

    newRow.draw(false);

    const newRowNode = newRow.node() as HTMLTableRowElement;
    newRowNode.id = 'add-new-row';

    if (topPageRow) topPageRow.insertAdjacentElement('beforebegin', newRowNode);

    const submitButton = new SubmitButton();
    const submitBtn = replaceEditIcon(newRow, this as Editable<D, boolean>, submitButton);
    submitBtn.addEventListener('click', (): void => {
      void this.submitNewRow(newRow);
    });

    const cancelButton = new CancelButton();
    const cancelBtn = replaceDeleteIcon(newRow, this as Editable<D, boolean>, cancelButton);
    cancelBtn.addEventListener('click', () => this.cancelNewRow(newRow));
  }

  /**
   * Get the Editable instance's fields as a Map.
   *
   *
   * @internal
   *
   * @returns A Map of the fields.
   */
  private get fieldsMap(): Map<string, Field<FieldType, keyof EditorType>> {
    return new Map(this.fields.map((field) => [field.options.name, field]));
  }

  private defaultEditorValue(
    editor: BaseEditor<
      keyof EditorType,
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): false | '' | 0 {
    switch (editor.type) {
      case 'string':
      case 'text':
        return '';
      case 'number':
        return 0;
      case 'checkbox':
        return false;
      default:
        return '';
    }
  }

  private getElementValue(element: HtmlElementsWithValue): boolean | string | number {
    if (element instanceof HTMLInputElement) {
      switch (element.type) {
        case 'checkbox':
          return element.checked;
        case 'string':
          return element.value;
        case 'number':
          return element.valueAsNumber;
        default:
          return element.value;
      }
    }

    return element.value;
  }

  private async submitNewRow(newRow: ApiRowMethods<D>): Promise<void> {
    const tr = newRow.node() as HTMLTableRowElement;
    const tds = tr.cells;

    const rowData = newRow.data();
    const { fields } = this;

    const { iconSrc } = this;
    const { iconMap } = this;
    const submitIcon = iconMap[iconSrc]['submit-row'];
    if (!submitIcon)
      throw new ReferenceError(
        `Please set a 'submit-row' icon for the 'iconSrc' specified: ${iconSrc}.`,
      );

    const formData: Record<string, Exclude<JsonValue, JsonArray | JsonObject | undefined>> = {};
    const invalidElements: HtmlElementsWithValue[] = [];

    for (const [idx, field] of fields.entries()) {
      const fieldOpts = field.options;
      const { editor } = fieldOpts;
      if (!editor) continue;

      const fieldName = fieldOpts.name;
      if (!(fieldName in rowData)) continue;

      const td = tds.item(idx);
      if (!td) continue;

      const element = td.firstElementChild;
      if (!element || !isHtmlElementsWithValue(element)) continue;

      editor.setElementValue(this.getElementValue(element));
      if (!editor.validateElement()) {
        invalidElements.push(element);
        continue;
      }

      formData[fieldName] = editor.getElementValue();
      rowData[fieldName as keyof D] = editor.getElementValue() as D[typeof fieldName];
    }

    if (invalidElements.length !== 0) return;

    const { postDataSrc } = this.options;
    if (!postDataSrc) throw new ReferenceError('Please set a `postDataSrc` property.');

    const { postDataSrcSource } = this;
    if (!postDataSrcSource || postDataSrcSource.trim().length === 0)
      throw new ReferenceError('Please set a `src` in the `postDataSrc` property.');

    const postDataSrcMethod = this.potsDataSrcMethod ?? 'POST';
    const postDataSrcFormat = this.postDataSrcFormat ?? 'json';

    const http = new Http(postDataSrcSource);

    const rowIdKey = this.options.rowId;
    if (!rowIdKey) throw new ReferenceError('Please set a `rowId`');

    try {
      const res = await http.post<typeof formData, Response>(
        formData,
        undefined,
        postDataSrcMethod,
        postDataSrcFormat,
      );

      const rowId = res.data.content[rowIdKey];
      if (!rowId) throw new ReferenceError(`Could not find ${rowIdKey} in the response.`);

      (newRow.node() as HTMLTableRowElement).id = String(rowId);

      this.emit(Events.UPDATED, { test: 'AAAAAAAAAAA' });
      newRow.data(rowData).draw(false);
    } catch (err) {
      console.error(err);
    }
  }

  private cancelNewRow(newRow: ApiRowMethods<D>): Api<Node> {
    return newRow.remove().draw(false);
  }

  private renderCheckboxField(field: Field<'html', 'checkbox'>): ConfigColumns {
    return {
      name: field.options.name,
      type: 'html',
      orderable: field.options.orderable,
      visible: field.options.visible,
      data: field.options.name,
      render(data): string {
        if (typeof data !== 'boolean' && typeof data !== 'string')
          throw new TypeError(`Expected boolean instead received ${typeof data}`);

        if (typeof data === 'boolean')
          return data
            ? (field.options.editor as Checkbox).options.activeLabel
            : (field.options.editor as Checkbox).options.inactiveLabel;

        return data;
      },
    };
  }

  private renderField(field: Field<FieldType, keyof EditorType>): ConfigColumns {
    return {
      name: field.options.name,
      type: field.options.type,
      orderable: field.options.orderable,
      visible: field.options.visible,
      data: field.options.name,
    };
  }

  /**
   * Convert the fields into columns.
   *
   * @internal
   *
   * @returns An array of ConfigColumns.
   */
  private fieldsMapToColumns(): ConfigColumns[] {
    return Array.from(this.fieldsMap.values()).map<ConfigColumns>((field) =>
      isCheckboxEditor(field.options.editor)
        ? this.renderCheckboxField(field as Field<'html', 'checkbox'>)
        : this.renderField(field),
    );
  }

  private buttonsMapToColumns(): ConfigColumns[] {
    if (!this.buttons) return [];

    return this.buttons.map<ConfigColumns>((button) => ({
      type: 'html',
      orderable: false,
      data: null,
      render: (_row, _type, _set, { row }): HTMLSpanElement['outerHTML'] => {
        if (button.type === ButtonTypeIconMap.EDIT && !this.isEditable)
          throw new Error(
            "Can't have an edit button on this instance because the `editable` property is set to false.",
          );

        return button.generateHtml(this.dataTable.row(row), this).outerHTML;
      },
      createdCell: (cell): void => {
        (cell as HTMLTableCellElement).addEventListener('click', (evt): void => {
          const tr = (cell as HTMLTableCellElement).closest('tr');
          if (!tr)
            throw new Error(
              'Could not find the closest row to this cell this is a bug, REPORT IMMEDIATLY.',
            );

          const row = this.dataTable.row(`#${tr.id}`);

          button.onClick(evt, row, row.data(), this);
        });
      },
    }));
  }

  private generateConfigColumns(): ConfigColumns[] {
    return [...this.fieldsMapToColumns(), ...this.buttonsMapToColumns()];
  }

  /**
   * Initiate a new DataTables instance.
   * @param table - The HTML Table.
   * @param config - The DataTables configuration options.
   *
   * @internal
   *
   * @returns The new DataTables instance.
   */
  private initDatatables(table: HTMLTableElement, config: Config): Api<D> {
    return new DataTable(table, config);
  }
}
