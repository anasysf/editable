import type Column from '../column';
import type { JSONValues } from '../types';
import type {
  DeleteDataSrcHTTPMethod,
  UpdateDataSrcHTTPMethod,
  HTTPRequestFormat,
  Options,
  IconSrc,
} from './types';
import type { Api } from 'datatables.net-bs5';
import EditorManager from '../column/editorManager';
import FieldManager from '../column/fieldManager';
import HTTP from '../http';
import ResponseError from '../http/responseError';

export default class EventHandler<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  private readonly _columns: Map<number, Column> = new Map();
  private readonly _dataTable: Api<TData>;
  private readonly _editableOptions: Options;

  public constructor(
    columns: Map<number, Column>,
    dataTable: Api<TData>,
    editableOptions: Options,
  ) {
    this._columns = columns;
    this._dataTable = dataTable;
    this._editableOptions = editableOptions;
  }

  private get columns(): Map<number, Column> {
    return this._columns;
  }

  private get dataTable(): Api<TData> {
    return this._dataTable;
  }

  private get editableOptions(): Options {
    return this._editableOptions;
  }

  private get updateDataSrcURL(): string {
    return typeof this.editableOptions.updateDataSrc === 'object'
      ? this.editableOptions.updateDataSrc.src
      : this.editableOptions.updateDataSrc;
  }

  private get updateDataSrcMethod(): UpdateDataSrcHTTPMethod {
    return typeof this.editableOptions.updateDataSrc === 'object'
      ? this.editableOptions.updateDataSrc.method
      : 'POST';
  }

  private get updateDataSrcFormat(): HTTPRequestFormat {
    return typeof this.editableOptions.updateDataSrc === 'object'
      ? this.editableOptions.updateDataSrc.format ?? 'json'
      : 'json';
  }

  private get deleteDataSrcURL(): string {
    return typeof this.editableOptions.deleteDataSrc === 'object'
      ? this.editableOptions.deleteDataSrc.src
      : this.editableOptions.deleteDataSrc;
  }

  private get deleteDataSrcMethod(): DeleteDataSrcHTTPMethod {
    return typeof this.editableOptions.deleteDataSrc === 'object'
      ? this.editableOptions.deleteDataSrc.method
      : 'POST';
  }

  private get deleteDataSrcFormat(): HTTPRequestFormat {
    return typeof this.editableOptions.deleteDataSrc === 'object'
      ? this.editableOptions.deleteDataSrc.format ?? 'json'
      : 'json';
  }

  private get iconSrc(): IconSrc {
    return this.editableOptions.iconSrc ?? 'fa';
  }

  public handle(evt: MouseEvent): void {
    const target = evt.target;
    if (!target) return;

    const targetName = (target as HTMLElement).getAttribute('name');

    switch (targetName) {
      case 'edit-row-icon': {
        this.handleOnEditRowClick(target as HTMLElement);
        return;
      }
      case 'delete-row-icon': {
        return void this.handleOnDeleteRowClick(target as HTMLElement);
      }
      case 'cancel-row-edit-icon': {
        this.handleOnCancelEditRowClick(target as HTMLElement);
        return;
      }
      case 'save-row-edit-icon': {
        return void this.handleOnSaveEditRowClick(target as HTMLElement);
      }
      default:
        break;
    }
  }

  private handleOnEditRowClick(target: HTMLElement): void {
    const hasEditor = [...this.columns.values()].some((column) => column.editorOptions);
    if (!hasEditor) return;

    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    const deleteIconBtn = tr.querySelector('[name="delete-row-icon"]');
    if (!deleteIconBtn)
      throw new ReferenceError('Could not find a delete button on this row.');

    const tds = tr.cells;
    if (tds.length === 0)
      throw new ReferenceError(`Could not find a single cell on this row.`);

    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const rowIdx = row.index();

    [...tds].forEach((td, idx) => {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);

      const editorOptions = column.editorOptions;

      if (!editorOptions) return;
      const editorManager = new EditorManager(editorOptions);
      const field = column.field as keyof TData;

      const editor = editorManager.generateEditorHTML(rowData[field] as string);

      td.firstChild ? td.replaceChild(editor, td.firstChild) : td.appendChild(editor);
    });

    const iconSrcMap = FieldManager.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new ReferenceError(
        `Expected a valid 'iconSrcMap' instead received: ${iconSrcMap}.`,
      );

    const editIcon = iconSrcMap['save-row-edit'];
    FieldManager.toggleIcon(target, 'save-row-edit', 'Enregistrer', rowIdx, editIcon);

    const deleteIcon = iconSrcMap['cancel-row-edit'];
    FieldManager.toggleIcon(deleteIconBtn, 'cancel-row-edit', 'Annuler', rowIdx, deleteIcon);
  }

  private handleOnCancelEditRowClick(target: HTMLElement): void {
    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    const row = this.dataTable.row(tr);
    const rowData = row.data();

    row.data(rowData).draw(false);
  }

  private async handleOnSaveEditRowClick(target: HTMLElement): Promise<void> {
    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    const tds = tr.cells;
    if (tds.length === 0)
      throw new ReferenceError(`Could not find a single cell on this row.`);

    const formData: Record<string, unknown> = {};

    const row = this.dataTable.row(tr);
    const rowData = row.data();

    [...tds].forEach((td, idx) => {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);

      if (!column.submittable) return;

      const el = td.firstElementChild;
      if (!el) return;

      const field = column.field as keyof TData;

      formData[field as string] = (el as HTMLInputElement).value;
      rowData[field] = (el as HTMLInputElement).value as TData[typeof field];
    });

    const http = new HTTP(this.updateDataSrcURL);

    try {
      await http.send(
        { method: this.updateDataSrcMethod as string },
        this.updateDataSrcFormat,
        formData,
      );

      row.data(rowData).draw(false);
    } catch (err) {
      if (err instanceof ResponseError)
        if (this.editableOptions.onHTTPError) {
          this.editableOptions.onHTTPError(err.status, err.statusText, err.url);
          return;
        }

      throw err;
    }
  }

  private async handleOnDeleteRowClick(target: HTMLElement): Promise<void> {
    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    const rowIdKey = this.editableOptions.rowId;
    if (!rowIdKey)
      throw new ReferenceError(`Expected rowId to be set instead received: ${rowIdKey}.`);

    const tds = tr.cells;
    if (tds.length === 0)
      throw new ReferenceError(`Could not find a single cell on this row.`);

    const row = this.dataTable.row(tr);

    const http = new HTTP(this.deleteDataSrcURL);

    const formData = {
      [rowIdKey]: row.id(),
    };

    try {
      await http.send(
        { method: this.deleteDataSrcMethod as string },
        this.deleteDataSrcFormat,
        formData,
      );

      row.remove().draw(false);
    } catch (err) {
      if (err instanceof ResponseError)
        if (this.editableOptions.onHTTPError) {
          this.editableOptions.onHTTPError(err.status, err.statusText, err.url);
          return;
        }

      throw err;
    }
  }
}
