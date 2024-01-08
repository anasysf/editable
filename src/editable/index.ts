import type { JSONValues } from '@/types';
import type {
  Options,
  IOptions,
  DataSrc,
  DataSrcHTTPMethod,
  UpdateDataSrc,
  UpdateDataSrcHTTPMethod,
  DeleteDataSrc,
  DeleteDataSrcHTTPMethod,
  PostDataSrc,
  PostDataSrcHTTPMethod,
  HTTPRequestFormat,
  IconSrc,
  IconSrcMap,
  Icons,
  ClassNames,
  ClassNamesMap,
} from './types';
import type { EditableEventsMap } from './types/events';
import { EditableEvent } from './types/events';
import type { Config, Api, ConfigColumns } from 'datatables.net-bs5';
import DataTable from 'datatables.net-bs5';
import Column from '@/column';
import type { ColumnField } from '@/column/types';
import EventHandler from './eventHandler';
import EditorManager from '@/column/editor';
import EventEmitter from '@utils/eventEmitter';
import { toggleIcon } from '@utils';

/**
 * Class representing an Editable instance.
 * @internal
 */
export default class Editable<
  TData extends Record<string, JSONValues> = Record<string, JSONValues>,
> extends EventEmitter<EditableEventsMap<TData>> {
  /** The HTML Table Element. */
  private readonly _table: HTMLTableElement;

  /** The options used by this Editable instance. */
  private _options!: Options;

  private readonly _iconSrcMap: IconSrcMap = new Map();
  private readonly _classNamesMap: ClassNamesMap = new Map();

  /** The options used by the DataTables instance. */
  private readonly _dataTableConfig: Config;

  private _dataTable!: Api<TData>;

  private _columns: Map<number, Column<TData>> = new Map();

  private _eventHandler: EventHandler<TData>;

  /**
   * Initiate a new Editable instance.
   * @param options - The options passed by the user.
   */
  public constructor(table: HTMLTableElement, options: IOptions) {
    super();
    this._table = table;

    this.options = options;

    this._iconSrcMap = new Map(
      Object.entries(this.options.iconSrcMap) as [IconSrc, Record<Icons, string>][],
    );
    this._classNamesMap = new Map(
      Object.entries(this.options.classNamesMap) as [ClassNames, string][],
    );

    this.columns = this.table;

    this._dataTableConfig = this.setDataTableConfig();

    this.dataTable = this.dataTableConfig;

    this._eventHandler = new EventHandler(this);

    this.registerEvents();
  }

  public get table(): HTMLTableElement {
    return this._table;
  }

  private get tbody(): HTMLTableSectionElement | null {
    return this.table.tBodies.item(0);
  }

  public get columns(): Map<number, Column<TData>> {
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

  public get classNamesMap(): ClassNamesMap {
    return this._classNamesMap;
  }

  public get iconSrcMap(): IconSrcMap {
    return this._iconSrcMap;
  }

  public get iconSrc(): IconSrc {
    return this.options.iconSrc;
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
    return typeof this.dataSrc === 'object' ? this.dataSrc.method ?? 'GET' : 'GET';
  }

  private get dataSrcData(): TData | undefined {
    return typeof this.dataSrc === 'object' ? this.dataSrc.data : undefined;
  }

  private get updateDataSrc(): UpdateDataSrc {
    return this.options.updateDataSrc;
  }

  public get updateDataSrcURL(): string {
    return typeof this.updateDataSrc === 'object'
      ? this.updateDataSrc.src
      : this.updateDataSrc;
  }

  public get updateDataSrcMethod(): UpdateDataSrcHTTPMethod {
    return typeof this.updateDataSrc === 'object' ? this.updateDataSrc.method ?? 'PUT' : 'PUT';
  }

  public get updateDataSrcFormat(): HTTPRequestFormat {
    return typeof this.updateDataSrc === 'object'
      ? this.updateDataSrc.format ?? 'json'
      : 'json';
  }

  private get deleteDataSrc(): DeleteDataSrc {
    return this.options.deleteDataSrc;
  }

  public get deleteDataSrcURL(): string {
    return typeof this.deleteDataSrc === 'object'
      ? this.deleteDataSrc.src
      : this.deleteDataSrc;
  }

  public get deleteDataSrcMethod(): DeleteDataSrcHTTPMethod {
    return typeof this.deleteDataSrc === 'object'
      ? this.deleteDataSrc.method ?? 'DELETE'
      : 'DELETE';
  }

  public get deleteDataSrcFormat(): HTTPRequestFormat {
    return typeof this.deleteDataSrc === 'object'
      ? this.deleteDataSrc.format ?? 'json'
      : 'json';
  }

  private get postDataSrc(): PostDataSrc {
    return this.options.postDataSrc;
  }

  public get postDataSrcURL(): string {
    return typeof this.postDataSrc === 'object' ? this.postDataSrc.src : this.postDataSrc;
  }

  public get postDataSrcMethod(): PostDataSrcHTTPMethod {
    return typeof this.postDataSrc === 'object' ? this.postDataSrc.method ?? 'POST' : 'POST';
  }

  public get postDataSrcFormat(): HTTPRequestFormat {
    return typeof this.postDataSrc === 'object' ? this.postDataSrc.format ?? 'json' : 'json';
  }

  public get isEditable(): boolean {
    return this.options.editable;
  }

  private get eventHandler(): EventHandler<TData> {
    return this._eventHandler;
  }

  /**
   * Set the options used by this Editable instance.
   * @throws {SyntaxError} If the options passed are undefined or if they don't match the structure required.
   */
  private set options(options: IOptions) {
    /* ================ dataSrc option CHECK START ================ */
    if (!options.dataSrc) throw new SyntaxError('The `dataSrc` option is required.');

    let dataSrc = options.dataSrc;

    if (typeof dataSrc === 'object') {
      if (!dataSrc.src || dataSrc.src.length === 0)
        throw new SyntaxError("The dataSrc's `src` property is required.");
      if (!dataSrc.method || dataSrc.method.trim().length === 0)
        dataSrc = {
          ...dataSrc,
          method: 'GET',
        };
    } else if (dataSrc.trim().length === 0)
      throw new SyntaxError('The `dataSrc` option is required.');
    /* ================ dataSrc option CHECK END ================ */

    /* ================ iconSrcMap option CHECK START ================ */
    const iconSrc = options.iconSrc ?? 'fa';

    const iconSrcMap: Record<IconSrc, Record<Icons, string>> = {
      fa: {
        delete: 'fa-regular fa-trash-can text-danger',
        edit: 'fa-regular fa-pen-to-square text-primary',
        'save-row-edit': 'fa-solid fa-check text-success',
        'cancel-row-edit': 'fa-solid fa-xmark text-danger',
        'save-new-row': 'fa-solid fa-check text-success',
        'cancel-new-row': 'fa-solid fa-xmark text-danger',
      },
      ...options.iconSrcMap,
    };
    /* ================ iconSrcMap option CHECK END ================ */

    /* ================ updateDataSrc option CHECK START ================ */
    if (!options.updateDataSrc)
      throw new SyntaxError('The `updateDataSrc` option is required.');

    let updateDataSrc = options.updateDataSrc;

    if (typeof updateDataSrc === 'object') {
      if (!updateDataSrc.src || updateDataSrc.src.length === 0)
        throw new SyntaxError("The updateDataSrc's `src` property is required.");
      if (!updateDataSrc.method || updateDataSrc.method.trim().length === 0)
        updateDataSrc = {
          ...updateDataSrc,
          method: 'POST',
        };
      if (!updateDataSrc.format)
        updateDataSrc = {
          ...updateDataSrc,
          format: 'json',
        };
    } else if (updateDataSrc.trim().length === 0)
      throw new SyntaxError('The `updateDataSrc` option is required.');
    /* ================ updateDataSrc option CHECK END ================ */

    /* ================ deleteDataSrc option CHECK START ================ */
    if (!options.deleteDataSrc)
      throw new SyntaxError('The `deleteDataSrc` option is required.');

    let deleteDataSrc = options.deleteDataSrc;

    if (typeof deleteDataSrc === 'object') {
      if (!deleteDataSrc.src || deleteDataSrc.src.length === 0)
        throw new SyntaxError("The deleteDataSrc's `src` property is required.");
      if (!deleteDataSrc.method || deleteDataSrc.method.trim().length === 0)
        deleteDataSrc = {
          ...deleteDataSrc,
          method: 'POST',
        };
      if (!deleteDataSrc.format)
        deleteDataSrc = {
          ...deleteDataSrc,
          format: 'json',
        };
    } else if (deleteDataSrc.trim().length === 0)
      throw new SyntaxError('The `deleteDataSrc` option is required.');
    /* ================ deleteDataSrc option CHECK END ================ */

    /* ================ postDataSrc option CHECK START ================ */
    if (!options.postDataSrc) throw new SyntaxError('The `postDataSrc` option is required.');

    let postDataSrc = options.postDataSrc;

    if (typeof postDataSrc === 'object') {
      if (!postDataSrc.src || postDataSrc.src.length === 0)
        throw new SyntaxError("The postDataSrc's `src` property is required.");
      if (!postDataSrc.method || postDataSrc.method.trim().length === 0)
        postDataSrc = {
          ...postDataSrc,
          method: 'POST',
        };
      if (!postDataSrc.format)
        postDataSrc = {
          ...postDataSrc,
          format: 'json',
        };
    } else if (postDataSrc.trim().length === 0)
      throw new SyntaxError('The `postDataSrc` option is required.');
    /* ================ postDataSrc option CHECK END ================ */

    const rowId = options.rowId;
    if (!rowId) throw new ReferenceError('A rowId must be set.');

    const classNamesMap: Record<ClassNames, HTMLElement['className']> = {
      'inp-string': 'form-control form-control-sm',
      'inp-num': 'form-control form-control-sm',
      'inp-email': 'form-control form-control-sm',
      textarea: 'form-control form-control-sm',
      sel: 'form-select form-select-sm',
      'inp-valid': 'is-valid',
      'inp-invalid': 'is-invalid',
      ...options.classNamesMap,
    };

    const editable = options.editable ?? true;

    this._options = {
      rowId,
      dataSrc,
      updateDataSrc,
      deleteDataSrc,
      postDataSrc,
      iconSrc,
      iconSrcMap,
      classNamesMap,
      editable,
    };
  }

  private set dataTable(config: Config) {
    this._dataTable = new DataTable<TData>(this.table, config);
  }

  private set columns(table: HTMLTableElement) {
    const colgroup = this.getColgroup(table);
    const cols = this.getColsInColgroup(colgroup);

    this._columns = new Map(
      cols.map((col, idx) => [idx, new Column(col.dataset.options, this)]),
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
    // const formattedColumns: ColumnType[] = ['money', 'money-3'] as const;
    const editors: Record<string, (() => HTMLElement['outerHTML']) | undefined> = {};

    for (const column of Array.from(this.columns.values())) {
      let editorOptions = column.editorOptions;

      if (!editorOptions)
        editorOptions = {
          type: 'string',
          required: true,
          disabled: false,
        };

      const editorManager = new EditorManager(column);
      if (defaultColumns.includes(column.field)) editors[column.field] = undefined;
      else
        editors[column.field] = (): HTMLTableCellElement['innerHTML'] =>
          editorManager.generateEditorHTML().outerHTML;
    }

    const currentPageRows = (
      this.dataTable.rows({ page: 'current' }).nodes().toArray() as HTMLTableRowElement[]
    ).at(0);

    const newRow = this.dataTable.row.add(editors);
    const newRowNode = newRow.node() as HTMLTableRowElement;
    newRowNode.id = 'save-new-row';

    const iconSrcMap = this.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new ReferenceError(
        `Expected a valid 'iconSrcMap' instead received: ${iconSrcMap}.`,
      );

    const newRowEditIcon = newRowNode.querySelector('[name="edit-row-icon"]');
    const newRowDeleteIcon = newRowNode.querySelector('[name="delete-row-icon"]');

    if (!newRowEditIcon || !newRowDeleteIcon) return;

    const rowIdx = newRowNode.rowIndex - 1;

    const saveRowIcon = iconSrcMap['save-new-row'];
    toggleIcon(newRowEditIcon, 'save-new-row', 'Enregistrer', rowIdx, saveRowIcon);

    const cancelRowIcon = iconSrcMap['cancel-new-row'];
    toggleIcon(newRowDeleteIcon, 'cancel-new-row', 'Annuler', rowIdx, cancelRowIcon);

    if (!currentPageRows) {
      newRow.draw(false);
    } else {
      currentPageRows.insertAdjacentElement('beforebegin', newRowNode);
    }

    this.emit(EditableEvent.NEW_ROW, { tr: newRowNode, row: newRow });
  }

  private registerEvents(): void {
    if (!this.tbody)
      throw new ReferenceError(
        `Could not find a <tbody> element on this <table>: #${this.table.id}.`,
      );

    this.tbody.addEventListener('click', (evt) => {
      this.eventHandler.handleByName(evt);
    });
  }
}
