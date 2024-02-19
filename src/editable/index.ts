import type { Api, Config, ConfigColumns } from 'datatables.net-bs5';
import DataTable from 'datatables.net-bs5';
import type IconButtonBase from '../button/base';
import { ButtonTypeIconMap } from '../button/types';
import type { EditorType } from '../editor/types/options';
import type Field from '../field';
import type { FieldType } from '../field/types/options';
import type { HTTPRequestFormat, JSONValue, TableID } from '../types';
import EventEmitter from '../utils/event-emitter';
import { isString } from '../utils/type-guard';
import { defaultConfig } from './defaults/config';
import { defaultOptions } from './defaults/options';
import type { EventMap } from './types/events';
import type { NormalizedOptions, Options } from './types/options';
import type { DeleteDataSrc, DeleteDataSrcMethod } from './types/options/deleteDataSrc';
import type { IconMap, IconSrc } from './types/options/iconMap';
import type { UpdateDataSrc, UpdateDataSrcMethod } from './types/options/updateDataSrc';
import { isEditableOptions } from './utils/type-guard';
import { validateTableElement } from './utils/validation';

/**
 * Class representing the Editable instance.
 * @typeParam TData - The type of the data in the Editable instance.
 */
export default class Editable<
  TData extends Record<string, JSONValue>,
  E extends boolean | undefined = true,
> extends EventEmitter<EventMap> {
  /** The HTML Table element ID. */
  public readonly tableId: TableID;

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
  public readonly dataTable: Api<TData>;

  /**
   * Create a new Editable instance.
   * @param tableId - The Table element's ID that the instance attaches to.
   * @param options - The Editable instance's options.
   */
  public constructor(tableId: TableID, options: Options<E>) {
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
    this.dataTable = this.initDT(this.table, this.config);
  }

  public get isEditable(): boolean {
    return this.options.editable;
  }

  /**
   * Get the Editable instance's fields.
   *
   * @returns An array of the fields.
   */
  public get fields(): Field<FieldType, keyof EditorType>[] {
    return this.options.fields;
  }

  public get buttons(): IconButtonBase<ButtonTypeIconMap>[] | undefined {
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
  }

  public get updateDataSrcSource(): string | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return this.updateDataSrc;
      else return this.updateDataSrc?.src;
  }

  public get updateDataSrcMethod(): UpdateDataSrcMethod | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'PUT';
      else return this.updateDataSrc?.method ?? 'PUT';
  }

  public get updateDataSrcFormat(): HTTPRequestFormat | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'json';
      else return this.updateDataSrc?.format ?? 'json';
  }

  public get updateDataSrcProp(): string | undefined {
    if (isEditableOptions(this.options))
      if (isString(this.updateDataSrc)) return 'result.content';
      else return this.updateDataSrc?.prop ?? 'result.content';
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

  public get deleteDataSrcFormat(): HTTPRequestFormat | undefined {
    return isString(this.deleteDataSrc) ? 'json' : this.deleteDataSrc?.format ?? 'json';
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
      type: field.options.type,
      sortable: field.options.sortable,
      visible: field.options.visible,
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
        if (button.type === ButtonTypeIconMap.EDIT && !this.isEditable)
          throw new Error(
            "Can't have an edit button on this instance because the `editable` property is set to false.",
          );

        return button.generateHTML(this.dataTable.row(row), this).outerHTML;
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
  private initDT(table: HTMLTableElement, config: Config): Api<TData> {
    return new DataTable(table, config);
  }
}
