import type Column from '../column';
import type { JSONValues } from '../types';
import type {
  DeleteDataSrcHTTPMethod,
  UpdateDataSrcHTTPMethod,
  PostDataSrcHTTPMethod,
  HTTPRequestFormat,
  Options,
  IconSrc,
} from './types';
import type { Api } from 'datatables.net-bs5';
import EditorManager from '../column/editorManager';
import type { ColumnField, HTMLElementWithValue } from '../column/types';
import FieldManager from '../column/fieldManager';
import HTTP from '../http';
import ResponseError from '../http/responseError';
import type Editable from './';

export default class EventHandler<
  TData extends Record<string, JSONValues> = Record<string, never>,
> {
  private readonly _editable: Editable<TData>;

  public constructor(editable: Editable<TData>) {
    this._editable = editable;
  }

  private get editable(): Editable<TData> {
    return this._editable;
  }

  private get columns(): Map<number, Column<TData>> {
    return this.editable.columns;
  }

  private get columnsValues(): Column<TData>[] {
    return Array.from(this.columns.values());
  }

  private get dataTable(): Api<TData> {
    return this.editable.dataTable;
  }

  private get editableOptions(): Options {
    return this.editable.options;
  }

  private get updateDataSrcURL(): string {
    return this.editable.updateDataSrcURL;
  }

  private get updateDataSrcMethod(): UpdateDataSrcHTTPMethod {
    return this.editable.updateDataSrcMethod;
  }

  private get updateDataSrcFormat(): HTTPRequestFormat {
    return this.editable.updateDataSrcFormat;
  }

  private get deleteDataSrcURL(): string {
    return this.editable.deleteDataSrcURL;
  }

  private get deleteDataSrcMethod(): DeleteDataSrcHTTPMethod {
    return this.editable.deleteDataSrcMethod;
  }

  private get deleteDataSrcFormat(): HTTPRequestFormat {
    return this.editable.deleteDataSrcFormat;
  }

  private get postDataSrcURL(): string {
    return this.editable.postDataSrcURL;
  }

  private get postDataSrcMethod(): PostDataSrcHTTPMethod {
    return this.editable.postDataSrcMethod;
  }

  private get postDataSrcFormat(): HTTPRequestFormat {
    return this.editable.postDataSrcFormat;
  }

  private get iconSrc(): IconSrc {
    return this.editable.iconSrc;
  }

  public handleByName(evt: MouseEvent): void {
    const target = evt.target;

    if (!target || !(target instanceof HTMLElement)) return;

    const targetName = target.getAttribute('name');
    if (!targetName || targetName.trim().length === 0) return;

    switch (targetName) {
      case 'edit-row-icon': {
        this.handleOnEditRowClick(target);
        break;
      }
      case 'delete-row-icon': {
        void this.handleOnDeleteRowClick(target);
        break;
      }
      case 'cancel-row-edit-icon': {
        this.handleOnCancelEditRowClick(target);
        break;
      }
      case 'save-row-edit-icon': {
        void this.handleOnSaveEditRowClick(target);
        break;
      }
      case 'save-new-row-icon': {
        void this.handleOnSaveNewRowClick(target);
        break;
      }
      case 'cancel-new-row-icon': {
        this.handleOnCancelNewRowClick(target);
        break;
      }
      default:
        break;
    }
  }

  private getTrFromTarget(target: HTMLElement): HTMLTableRowElement {
    if (!(target instanceof HTMLTableRowElement)) {
      const tr = target.closest('tr');
      if (!tr)
        throw new ReferenceError('Could not find the closest <tr> element to the target.');

      return tr;
    }

    return target;
  }

  private getElementByName<T extends HTMLElement = HTMLElement>(
    source: HTMLElement,
    name: string,
  ): T {
    const element = source.querySelector<T>(`[name="${name}"]`);
    if (!element)
      throw new ReferenceError(`Could not find an element with the name: ${name}.`);

    return element;
  }

  private getTrIndex(tr: HTMLTableRowElement): number {
    return tr.rowIndex === -1 ? tr.rowIndex : tr.rowIndex - 1;
  }

  private getCellsInTr(tr: HTMLTableRowElement): HTMLTableCellElement[] {
    const tds = tr.cells;
    if (tds.length === 0)
      throw new RangeError(
        `Could not find a single <td> on this <tr> element. row-index: ${this.getTrIndex(
          tr,
        )}.`,
      );

    return Array.from(tds);
  }

  private handleOnEditRowClick(target: HTMLElement): void {
    if (!this.editable.isEditable)
      throw new SyntaxError(
        "Seems like you're trying to edit a row on a non-editable <table>. Please make sure you have `editable` set to `true` in the options.",
      );

    const hasEditor = this.columnsValues.some((column) => column.isEditable);
    if (!hasEditor) return;

    const tr = this.getTrFromTarget(target);
    const tds = this.getCellsInTr(tr);

    const deleteBtn = this.getElementByName(tr, 'delete-row-icon');

    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const rowIdx = row.index();

    tds.forEach((td, idx) => {
      const column = this.columns.get(idx);
      if (!column) throw new RangeError(`Could not find a column at index: ${idx}.`);

      const editorOptions = column.editorOptions;
      if (!editorOptions) return;

      const editorManager = new EditorManager(column);
      const field = column.field as keyof TData;
      const editor = editorManager.generateEditorHTML(rowData[field] as string | number);

      td.firstChild ? td.replaceChild(editor, td.firstChild) : td.appendChild(editor);
    });

    const iconSrcMap = this.editable.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new ReferenceError(
        `Could not find a valid iconSrcMap for the iconSrc provided: ${this.iconSrc}.`,
      );

    const editIcon = iconSrcMap['save-row-edit'];
    FieldManager.toggleIcon(target, 'save-row-edit', 'Enregistrer', rowIdx, editIcon);

    const deleteIcon = iconSrcMap['cancel-row-edit'];
    FieldManager.toggleIcon(deleteBtn, 'cancel-row-edit', 'Annuler', rowIdx, deleteIcon);
  }

  private handleOnCancelEditRowClick(target: HTMLElement): void {
    const tr = this.getTrFromTarget(target);

    const row = this.dataTable.row(tr);
    const rowData = row.data();

    row.data(rowData).draw(false);
  }

  private async handleOnSaveEditRowClick(target: HTMLElement): Promise<void> {
    const tr = this.getTrFromTarget(target);
    const tds = this.getCellsInTr(tr);

    const table = this.dataTable.table().node() as HTMLTableElement;
    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const oldRowData = structuredClone(rowData);

    const invalidElements: HTMLElementWithValue[] = [];
    tds.forEach((td, idx) => {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);
      if (!column.submittable) return;

      const element = td.firstElementChild;
      if (!element || !EditorManager.isHTMLElementWithValue(element)) return;

      const editorManager = new EditorManager(column);
      if (!editorManager.checkValidity(element)) {
        this.editable.emit('inputInvalid', {
          message: element.validationMessage,
          table,
          tr,
          row,
          element,
          value: element.value,
        });

        invalidElements.push(element);
        return;
      }

      const field = column.field as keyof TData;
      rowData[field] = element.value as TData[typeof field];

      this.editable.emit('inputValid', {
        table,
        tr,
        row,
        element,
        value: element.value,
      });
    });

    if (invalidElements.length !== 0) return;

    const http = new HTTP(this.updateDataSrcURL);
    try {
      await http.send(
        { method: this.updateDataSrcMethod as string },
        this.updateDataSrcFormat,
        rowData,
      );

      row.data(rowData).draw(false);
      if (this.editableOptions.onUpdated)
        this.editableOptions.onUpdated(table, tr, row, rowData, oldRowData);
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
    const tr = this.getTrFromTarget(target);
    const row = this.dataTable.row(tr);

    const rowIdKey = this.editableOptions.rowId;
    const formData = {
      [rowIdKey]: row.id(),
    };

    const http = new HTTP(this.deleteDataSrcURL);
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

  private async handleOnSaveNewRowClick(target: HTMLElement): Promise<void> {
    const tr = this.getTrFromTarget(target);
    const tds = this.getCellsInTr(tr);

    const rowIdKey = this.editableOptions.rowId;

    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const table = this.dataTable.table().node() as HTMLTableElement;

    const http = new HTTP(this.postDataSrcURL);
    const defaultColumns: ColumnField[] = ['checkbox', 'delete', 'edit'] as const;
    const invalidElements: HTMLElement[] = [];
    tds.forEach((td, idx) => {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);
      if (!column.submittable) return;

      const field = column.field as keyof TData;
      if (defaultColumns.includes(field as ColumnField)) return;

      const element = td.firstElementChild;
      if (!element || !EditorManager.isHTMLElementWithValue(element)) return;

      const editorManager = new EditorManager(column);

      if (!editorManager.checkValidity(element)) {
        this.editable.emit('inputInvalid', {
          message: element.validationMessage,
          table,
          tr,
          row,
          element,
          value: element.value,
        });

        invalidElements.push(element);
        return;
      }

      rowData[field] = element.value as TData[typeof field];
      this.editable.emit('inputValid', {
        table,
        tr,
        row,
        element,
        value: element.value,
      });
    });
    if (invalidElements.length !== 0) return;

    try {
      interface Res {
        readonly content: {
          readonly result: string | number;
        };
      }

      const resData = (await http.send(
        { method: this.postDataSrcMethod as string },
        this.postDataSrcFormat,
        rowData,
      )) as unknown as Res;

      if (!('content' in resData) || !('result' in resData.content))
        throw new TypeError(
          'Invalid response: The rowId does not exist in the response JSON data.',
        );

      const data = {
        ...rowData,
        ...resData,
        [rowIdKey]: resData.content.result,
      };

      row.data(data).draw(false);
    } catch (err) {
      if (err instanceof ResponseError)
        if (this.editableOptions.onHTTPError) {
          this.editableOptions.onHTTPError(err.status, err.statusText, err.url);
          return;
        }

      throw err;
    }
  }

  private handleOnCancelNewRowClick(target: HTMLElement): void {
    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    this.dataTable.row(tr).remove().draw(false);
  }
}
