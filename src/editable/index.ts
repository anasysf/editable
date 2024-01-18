import type { Api, Config, ConfigColumns } from 'datatables.net-bs5';
import DataTable from 'datatables.net-bs5';
import type { JSONValue, TableID } from '../types';
import type { NormalizedOptions, Options } from './types/options';
import type { IconMap, IconSrc } from './types/options/iconMap';
import { defaultOptions } from './defaults/options';
import { defaultConfig } from './defaults/config';
import { validateTableElement } from './utils/validation';
import type Field from '../field';
import type { FieldType } from '../field/types/options';
import type { EditorType } from '../editor/types/options';
import type Editor from '../editor';
import type ButtonBase from '../button/base';

/**
 * Class representing the Editable instance.
 * @typeParam TData - The type of the data in the Editable instance.
 */
export default class Editable<TData extends Record<string, JSONValue>> {
  /**
   * The HTML Table element ID.
   *
   * @internal
   */
  private readonly _tableId: TableID;

  /**
   * The HTML Table element.
   *
   * @internal
   */
  private readonly _table: HTMLTableElement;

  /**
   * The Editable instance options.
   *
   * @internal
   */
  private readonly _options: NormalizedOptions;

  /**
   * The DataTable instance config.
   *
   * @internal
   */
  private readonly _config: Config;

  /**
   * The DataTable instance.
   * @typeParam TData - The data type.
   *
   * @internal
   */
  private readonly _dataTable: Api<TData>;

  /**
   * Create a new Editable instance.
   * @param tableId - The Table element's ID that the instance attaches to.
   * @param options - The Editable instance's options.
   */
  public constructor(tableId: TableID, options: Options) {
    // Validate the `tableId` & the element associated with it.
    const table = validateTableElement(tableId);

    // Get the default options.
    const opts = defaultOptions(options);

    // Set the tableId.
    this._tableId = tableId;

    // Set the table element.
    this._table = table;

    // Set the options.
    this._options = opts;

    // Generate the columns based on the fields passed in the options.
    const columns = this.generateConfigColumns();

    // Get the default DataTable config.
    const config = defaultConfig(options, columns);

    // Set the config.
    this._config = config;

    // Initiate the DataTables instance.
    this._dataTable = this.initDT(this.table, this.config);
  }

  /**
   * The table ID passed to the Editable constructor parameter.
   *
   * @returns The HTML Table ID.
   */
  public get tableId(): TableID {
    return this._tableId;
  }

  /**
   * Get the Table element associated with the Editable instance.
   *
   * @returns The HTML Table element.
   */
  public get table(): HTMLTableElement {
    return this._table;
  }

  /**
   * Get the Editable instance's options.
   *
   * @returns The Editable instance's options.
   */
  public get options(): NormalizedOptions {
    return this._options;
  }

  /**
   * Get the DataTable instance's config.
   *
   * @returns The DataTable instance's config.
   */
  public get config(): Config {
    return this._config;
  }

  /**
   * Get the DataTable instance.
   *
   * @returns The DataTable instance.
   */
  public get dataTable(): Api<TData> {
    return this._dataTable;
  }

  public get isEditable(): boolean {
    return this.options.editable;
  }

  /**
   * Get the Editable instance's fields.
   *
   * @returns An array of the fields.
   */
  public get fields(): Field<FieldType, EditorType>[] {
    return this.options.fields;
  }

  public get editors(): (Editor<EditorType> | undefined)[] {
    return this.fields.map((field) => field.editor);
  }

  public get buttons(): ButtonBase[] | undefined {
    return this.options.buttons;
  }

  public get iconSrc(): IconSrc {
    return this.options.iconSrc;
  }

  public get iconMap(): IconMap {
    return this.options.iconMap;
  }

  /* private get editorsMap(): Map<string, Editor<EditorType> | undefined> {
    return new Map(
      Array.from(this.fieldsMap.entries()).map(([name, field]) => [name, field.editor]),
    );
  } */

  /**
   * Get the Editable instance's fields as a Map.
   *
   *
   * @internal
   *
   * @returns A Map of the fields.
   */
  private get fieldsMap(): Map<string, Field<FieldType, EditorType>> {
    return new Map(this.fields.map((field) => [field.name, field]));
  }

  /**
   * Convert the fields into columns.
   *
   * @internal
   *
   * @returns An array of ConfigColumns.
   */
  private fieldsMapToColumns(): ConfigColumns[] {
    return Array.from(this.fieldsMap.entries()).map<ConfigColumns>(([name, field]) => ({
      name,
      type: field.type,
      sortable: field.sortable,
      visible: field.visible,
      data: name,
    }));
  }

  private buttonsMapToColumns(): ConfigColumns[] {
    if (!this.buttons) return [];

    return this.buttons.map<ConfigColumns>((button) => ({
      type: 'html',
      sortable: false,
      data: null,
      render: (_row, _type, _set, { row }): HTMLSpanElement['outerHTML'] => {
        const editRowIcon = this.iconMap[this.iconSrc]['edit-row'];
        if (!editRowIcon)
          throw new ReferenceError(
            `Please set a 'edit-row' icon for the 'iconSrc' specified: ${this.iconSrc}.`,
          );

        return button.generateHTML(this.dataTable.row(row), editRowIcon).outerHTML;
      },
      createdCell: (cell, _cd, _rd, rowIndex): void => {
        (cell as HTMLTableCellElement).addEventListener('click', (evt): void => {
          button.onClick(evt, this.dataTable.row(rowIndex), this);
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
  private initDT(table: HTMLTableElement, config: Config): Api<TData> {
    return new DataTable(table, config);
  }
}
