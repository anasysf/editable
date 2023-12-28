import type { JSONValues } from '../types';
import type { Options, IOptions, DataSrc, DataSrcHTTPMethod, IconSrc } from './types';
import type { Config, Api, ConfigColumns } from 'datatables.net-bs5';
import DataTable from 'datatables.net-bs5';
import Column from '../column';
import type { ColumnField } from '../column/types';
import EventHandler from './eventHandler';
import EditorManager from '../column/editorManager';
import FieldManager from '../column/fieldManager';

/**
 * Class representing an Editable instance.
 * @internal
 */
export default class Editable<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  /** The HTML Table Element. */
  private readonly _table: HTMLTableElement;

  /** The options used by this Editable instance. */
  private _options!: Options;

  /** The options used by the DataTables instance. */
  private readonly _dataTableConfig: Config;

  private _dataTable!: Api<TData>;

  private _columns: Map<number, Column> = new Map();

  private _eventHandler: EventHandler<TData>;

  /**
   * Initiate a new Editable instance.
   * @param options - The options passed by the user.
   */
  public constructor(table: HTMLTableElement, options: IOptions) {
    this._table = table;

    this.options = options;

    this.columns = this.table;

    this._dataTableConfig = this.setDataTableConfig();

    this.dataTable = this.dataTableConfig;

    this._eventHandler = new EventHandler(this.columns, this.dataTable, this.options);

    this.registerEvents();
  }

  public get table(): HTMLTableElement {
    return this._table;
  }

  private get tbody(): HTMLTableSectionElement | null {
    return this.table.tBodies.item(0);
  }

  public get columns(): Map<number, Column> {
    return this._columns;
  }

  /**
   * Get the options.
   * @internal
   *
   * @returns The options used by this Editable instance.
   */
  public get options(): Options {
    return this._options;
  }

  /**
   * Get the DataTable instance config.
   * @internal
   *
   * @returns The Config used by the DataTable instance.
   */
  public get dataTableConfig(): Config {
    return this._dataTableConfig;
  }

  /**
   * Get the DataTable instance.
   *
   * @returns The DataTable instance.
   */
  public get dataTable(): Api<TData> {
    return this._dataTable;
  }

  private get dataSrc(): DataSrc {
    return this.options.dataSrc;
  }

  private get dataSrcURL(): string {
    return typeof this.dataSrc === 'object' ? this.dataSrc.src : this.dataSrc;
  }

  private get dataSrcProp(): string {
    return typeof this.dataSrc === 'object' ? this.dataSrc.prop ?? '' : '';
  }

  private get dataSrcMethod(): DataSrcHTTPMethod {
    return typeof this.dataSrc === 'object' ? this.dataSrc.method : 'POST';
  }

  private get dataSrcData(): Record<PropertyKey, unknown> | undefined {
    return typeof this.dataSrc === 'object' ? this.dataSrc.data : undefined;
  }

  private get iconSrc(): IconSrc {
    return this.options.iconSrc ?? 'fa';
  }

  private get eventHandler(): EventHandler<TData> {
    return this._eventHandler;
  }

  /**
   * Set the options used by this Editable instance.
   * @throws {SyntaxError} If the options passed are undefined or if they don't match the structure required.
   */
  private set options(options: IOptions) {
    /** ================ dataSrc option CHECK START ================ */
    if (!options.dataSrc) throw new SyntaxError('The `dataSrc` option is required.');

    let dataSrc = options.dataSrc;

    if (typeof dataSrc === 'object') {
      if (!dataSrc.src || dataSrc.src.length === 0)
        throw new SyntaxError("The dataSrc's `src` property is required.");
      else if (dataSrc.method.trim().length === 0)
        dataSrc = {
          ...dataSrc,
          method: 'POST',
        };
    } else if (dataSrc.trim().length === 0)
      throw new SyntaxError('The `dataSrc` option is required.');
    /** ================ dataSrc option CHECK END ================ */

    /** ================ iconSrcMap option CHECK START ================ */
    const iconSrc = options.iconSrc ?? 'fa';
    /** ================ iconSrcMap option CHECK END ================ */

    /** ================ updateDataSrc option CHECK START ================ */
    if (!options.updateDataSrc)
      throw new SyntaxError('The `updateDataSrc` option is required.');

    let updateDataSrc = options.updateDataSrc;

    if (typeof updateDataSrc === 'object') {
      if (!updateDataSrc.src || updateDataSrc.src.length === 0)
        throw new SyntaxError("The updateDataSrc's `src` property is required.");
      else if (updateDataSrc.method.trim().length === 0)
        updateDataSrc = {
          ...updateDataSrc,
          method: 'POST',
        };
      else if (!updateDataSrc.format)
        updateDataSrc = {
          ...updateDataSrc,
          format: 'json',
        };
    } else if (updateDataSrc.trim().length === 0)
      throw new SyntaxError('The `updateDataSrc` option is required.');
    /** ================ updateDataSrc option CHECK END ================ */

    /** ================ deleteDataSrc option CHECK START ================ */
    if (!options.deleteDataSrc)
      throw new SyntaxError('The `deleteDataSrc` option is required.');

    let deleteDataSrc = options.deleteDataSrc;

    if (typeof deleteDataSrc === 'object') {
      if (!deleteDataSrc.src || deleteDataSrc.src.length === 0)
        throw new SyntaxError("The deleteDataSrc's `src` property is required.");
      else if (deleteDataSrc.method.trim().length === 0)
        deleteDataSrc = {
          ...deleteDataSrc,
          method: 'POST',
        };
      else if (!deleteDataSrc.format)
        deleteDataSrc = {
          ...deleteDataSrc,
          format: 'json',
        };
    } else if (deleteDataSrc.trim().length === 0)
      throw new SyntaxError('The `deleteDataSrc` option is required.');
    /** ================ deleteDataSrc option CHECK END ================ */

    /** ================ postDataSrc option CHECK START ================ */
    if (!options.postDataSrc) throw new SyntaxError('The `postDataSrc` option is required.');

    let postDataSrc = options.postDataSrc;

    if (typeof postDataSrc === 'object') {
      if (!postDataSrc.src || postDataSrc.src.length === 0)
        throw new SyntaxError("The postDataSrc's `src` property is required.");
      else if (postDataSrc.method.trim().length === 0)
        postDataSrc = {
          ...postDataSrc,
          method: 'POST',
        };
      else if (!postDataSrc.format)
        postDataSrc = {
          ...postDataSrc,
          format: 'json',
        };
    } else if (postDataSrc.trim().length === 0)
      throw new SyntaxError('The `postDataSrc` option is required.');
    /** ================ postDataSrc option CHECK END ================ */

    const rowId = options.rowId;
    if (!rowId) throw new ReferenceError('A rowId must be set.');

    this._options = {
      rowId,
      dataSrc,
      updateDataSrc,
      deleteDataSrc,
      postDataSrc,
      iconSrc,
    };
  }

  private set dataTable(config: Config) {
    this._dataTable = new DataTable<TData>(this.table, config);
  }

  private set columns(table: HTMLTableElement) {
    const colgroup = this.getColgroup(table);
    const cols = this.getColsInColgroup(colgroup);

    this._columns = new Map(
      cols.map((col, idx) => [idx, new Column(col.dataset.options, this.options)]),
    );
  }

  private getColgroup(table: HTMLTableElement = this.table): HTMLTableColElement {
    const colgroups = table.getElementsByTagName('colgroup');
    if (colgroups.length === 0)
      throw new ReferenceError(
        `The <table> element with the id: #${table.id} must contain a <colgroup>.`,
      );

    const colgroup = colgroups.item(0);
    if (!colgroup)
      throw new ReferenceError(
        `The <table> element with the id: #${table.id} must contain a <colgroup>.`,
      );

    return colgroup;
  }

  private getColsInColgroup(colgroup: HTMLTableColElement): HTMLTableColElement[] {
    if (!colgroup.hasChildNodes())
      throw new ReferenceError(
        'The <colgroup> element must contain at least one <col /> element.',
      );

    const cols = colgroup.getElementsByTagName('col');

    if (cols.length === 0)
      throw new ReferenceError(
        'The <colgroup> element must contain at least one <col /> element.',
      );

    return [...cols];
  }

  private setDataTableConfig(): Config {
    const columns: ConfigColumns[] = [...this.columns.values()].map((column) =>
      column.generateConfigColumns(),
    );

    const rowId = this.options.rowId;

    return {
      ajax: {
        url: this.dataSrcURL,
        dataSrc: this.dataSrcProp,
        method: this.dataSrcMethod as string,
        data: this.dataSrcData,
      },
      columns,
      rowId,
    };
  }

  public addRow(): void {
    const saveNewRowTr = this.tbody?.querySelector('#save-new-row');
    if (saveNewRowTr) return;

    const defaultColumns: ColumnField[] = ['checkbox', 'delete', 'edit'] as const;
    const editors: Record<string, (() => HTMLElement['outerHTML']) | undefined> = {};

    for (const column of [...this.columns.values()]) {
      let editorOptions = column.editorOptions;

      if (!editorOptions)
        editorOptions = {
          type: 'string',
          required: true,
          disabled: false,
        };

      const editorManager = new EditorManager(editorOptions);
      editors[column.field] = defaultColumns.includes(column.field)
        ? undefined
        : (): HTMLTableCellElement['innerHTML'] =>
            editorManager.generateEditorHTML('').outerHTML;
    }

    const currentPageRows = (
      this.dataTable.rows({ page: 'current' }).nodes().toArray() as HTMLTableRowElement[]
    ).at(0);

    const newRow = this.dataTable.row.add(editors);
    const newRowNode = newRow.node() as HTMLTableRowElement;
    newRowNode.id = 'save-new-row';

    const iconSrcMap = FieldManager.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new ReferenceError(
        `Expected a valid 'iconSrcMap' instead received: ${iconSrcMap}.`,
      );

    const newRowEditIcon = newRowNode.querySelector('[name="edit-row-icon"]');
    const newRowDeleteIcon = newRowNode.querySelector('[name="delete-row-icon"]');

    if (!newRowEditIcon || !newRowDeleteIcon) return;

    const rowIdx = newRowNode.rowIndex - 1;

    const saveRowIcon = iconSrcMap['save-new-row'];
    FieldManager.toggleIcon(
      newRowEditIcon,
      'save-new-row',
      'Enregistrer',
      rowIdx,
      saveRowIcon,
    );

    const cancelRowIcon = iconSrcMap['cancel-new-row'];
    FieldManager.toggleIcon(
      newRowDeleteIcon,
      'cancel-new-row',
      'Annuler',
      rowIdx,
      cancelRowIcon,
    );

    if (!currentPageRows) {
      newRow.draw(false);
    } else {
      currentPageRows.insertAdjacentElement('beforebegin', newRowNode);
    }
  }

  private registerEvents(): void {
    if (!this.tbody)
      throw new ReferenceError(
        `Could not find a <tbody> element on this <table>: #${this.table.id}.`,
      );

    this.tbody.addEventListener('click', (evt) => {
      this.eventHandler.handle(evt);
    });
  }
}
