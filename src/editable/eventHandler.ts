import type Column from '@/column';
import type { JSONValues } from '@/types';
import type {
  DeleteDataSrcHTTPMethod,
  UpdateDataSrcHTTPMethod,
  PostDataSrcHTTPMethod,
  HTTPRequestFormat,
  Options,
  IconSrc,
  ClassNamesMap,
  Res,
} from './types';
import type { Api } from 'datatables.net-bs5';
import EditorManager from '@/column/editorManager';
import type { ColumnField, HTMLElementWithValue } from '@/column/types';
import FieldManager from '@/column/fieldManager';
import HTTP from '@/http';
import ResponseError from '@/http/responseError';
import type Editable from '.';
import {
  getElementByName,
  getTrFromTarget,
  getCellsInTr,
  getElementNameAttribute,
  // formatNumber,
} from '@utils';

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

  private get classNamesMap(): ClassNamesMap {
    return this.editable.classNamesMap;
  }

  private get inpInvalidClass(): HTMLElement['className'] {
    return this.classNamesMap.get('inp-invalid') ?? 'is-invalid';
  }

  private get inpValidClass(): HTMLElement['className'] {
    return this.classNamesMap.get('inp-valid') ?? 'is-valid';
  }

  public handleByName(evt: MouseEvent): void {
    const target = evt.target;
    if (!target || !(target instanceof HTMLElement)) return;

    const targetName = getElementNameAttribute(target);

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

  /* public handleInputByName(evt: Event): void {
    const target = evt.target;
    if (!target || !(target instanceof HTMLInputElement)) return;

    const targetName = getElementNameAttribute(target);

    switch (targetName) {
      case 'inp-money': {
        this.handleOnInputMoney(target);
        break;
      }
      case 'inp-money-3': {
        this.handleOnInputMoney3(target);
        break;
      }
      default:
        break;
    }
  } */

  private handleOnEditRowClick(target: HTMLElement): void {
    if (!this.editable.isEditable)
      throw new SyntaxError(
        "Seems like you're trying to edit a row on a non-editable <table>. Please make sure you have `editable` set to `true` in the options.",
      );

    const hasEditor = this.columnsValues.some((column) => column.isEditable);
    if (!hasEditor)
      throw new ReferenceError('Not a single column has an `editor` object property.');

    const tr = getTrFromTarget(target);
    const tds = getCellsInTr(tr);

    const deleteBtn = getElementByName(tr, 'delete-row-icon');

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

    const table = this.dataTable.table().node() as HTMLTableElement;

    this.editable.emit('beforeEdit', { table, tr, row, rowData });
  }

  private handleOnCancelEditRowClick(target: HTMLElement): void {
    const tr = getTrFromTarget(target);

    const row = this.dataTable.row(tr);
    const rowData = row.data();

    const table = this.dataTable.table().node() as HTMLTableElement;

    this.editable.emit('beforeCancel', { table, tr, row, rowData });

    row.data(rowData).draw(false);

    this.editable.emit('afterCancel', { table, tr, row, rowData });
  }

  private async handleOnSaveEditRowClick(target: HTMLElement): Promise<void> {
    const tr = getTrFromTarget(target);
    const tds = getCellsInTr(tr);

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
        element.classList.remove(this.inpValidClass);
        element.classList.toggle(this.inpInvalidClass, true);

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
      element.classList.remove(this.inpInvalidClass);
      element.classList.toggle(this.inpValidClass, true);
    });

    if (invalidElements.length !== 0) return;

    this.editable.emit('afterEdit', { table, tr, row, rowData, oldRowData });

    const http = new HTTP(this.updateDataSrcURL);
    try {
      await http.send(
        { method: this.updateDataSrcMethod as string },
        this.updateDataSrcFormat,
        rowData,
      );

      row.data(rowData).draw(false);
      this.editable.emit('afterUpdate', { table, tr, row, rowData, oldRowData });
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit('httpError', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit('error', {
        message: (err as Error).message,
      });
      return;
    }
  }

  private async handleOnDeleteRowClick(target: HTMLElement): Promise<void> {
    const tr = getTrFromTarget(target);
    const row = this.dataTable.row(tr);
    const rowData = row.data();

    const rowIdKey = this.editableOptions.rowId;
    const formData = {
      [rowIdKey]: row.id(),
    };

    this.editable.emit('beforeDelete', { tr, row, rowData });

    const http = new HTTP(this.deleteDataSrcURL);
    try {
      await http.send(
        { method: this.deleteDataSrcMethod as string },
        this.deleteDataSrcFormat,
        formData,
      );

      row.remove().draw(false);
      this.editable.emit('afterDelete', { tr, row, rowData });
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit('httpError', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit('error', {
        message: (err as Error).message,
      });
      return;
    }
  }

  private async handleOnSaveNewRowClick(target: HTMLElement): Promise<void> {
    const tr = getTrFromTarget(target);
    const tds = getCellsInTr(tr);

    const rowIdKey = this.editableOptions.rowId;

    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const table = this.dataTable.table().node() as HTMLTableElement;

    this.editable.emit('beforeNewRowSave', { tr, row, rowData });

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
        element.classList.remove(this.inpValidClass);
        element.classList.toggle(this.inpInvalidClass, true);

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
      element.classList.remove(this.inpInvalidClass);
      element.classList.toggle(this.inpValidClass, true);
    });

    if (invalidElements.length !== 0) return;

    try {
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

      this.editable.emit('afterNewRowSave', { tr, row, rowData });
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit('httpError', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit('error', {
        message: (err as Error).message,
      });
      return;
    }
  }

  private handleOnCancelNewRowClick(target: HTMLElement): void {
    const tr = target.closest('tr');
    if (!tr) throw new ReferenceError(`Could not find the closest row.`);

    this.dataTable.row(tr).remove().draw(false);
  }

  /*
  private handleOnInputMoney(target: HTMLInputElement): void {
    target.value = formatNumber(target.value, 2, '.', ' ');
  }

  private handleOnInputMoney3(target: HTMLInputElement): void {
    target.value = formatNumber(target.value, 3, '.', ' ');
  }
  */
}
