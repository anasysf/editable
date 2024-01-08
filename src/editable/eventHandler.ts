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
import { EditableEvent } from './types/events';
import type { Api } from 'datatables.net-bs5';
import EditorManager from '@/column/editor';
import type { ColumnField, HTMLElementWithValue } from '@/column/types';
import HTTP from '@/http';
import ResponseError from '@/http/responseError';
import type Editable from '.';
import {
  getElementByName,
  getTrFromTarget,
  getCellsInTr,
  getElementNameAttribute,
  toggleIcon,
  // formatNumber,
} from '@utils';

export default class EventHandler<
  TData extends Record<string, JSONValues> = Record<string, JSONValues>,
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

  /**
   * Handles the event when the edit icon is clicked.
   * @param target - The HTML target Element.
   *
   * @internal
   * @throws {SyntaxError} - If the event is fired on a non-editable editable instance.
   * @throws {ReferenceError} - If no column has the property editor.
   * @throws {RangeError} - If no column was found with the index.
   */
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
    const elements: HTMLElementWithValue[] = [];

    for (const [idx, td] of tds.entries()) {
      const column = this.columns.get(idx);
      if (!column) throw new RangeError(`Could not find a column at index: ${idx}.`);

      const editorOptions = column.editorOptions;
      if (!editorOptions && column.type !== 'list-stc') continue;

      const editorManager = new EditorManager(column);
      const field = column.field as keyof TData;
      try {
        const editor = editorManager.generateEditorHTML(rowData[field] as string | number);
        td.firstChild ? td.replaceChild(editor, td.firstChild) : td.appendChild(editor);
        elements.push(editor);
      } catch (err) {
        this.editable.emit(EditableEvent.ERROR, { message: (err as Error).message });
        break;
      }
    }

    const iconSrcMap = this.editable.iconSrcMap.get(this.iconSrc);
    if (!iconSrcMap)
      throw new ReferenceError(
        `Could not find a valid iconSrcMap for the iconSrc provided: ${this.iconSrc}.`,
      );

    const editIcon = iconSrcMap['save-row-edit'];
    toggleIcon(target, 'save-row-edit', 'Enregistrer', rowIdx, editIcon);

    const deleteIcon = iconSrcMap['cancel-row-edit'];
    toggleIcon(deleteBtn, 'cancel-row-edit', 'Annuler', rowIdx, deleteIcon);

    this.editable.emit(EditableEvent.EDIT, { tr, row, rowData, elements });
  }

  private handleOnCancelEditRowClick(target: HTMLElement): void {
    const tr = getTrFromTarget(target);

    const row = this.dataTable.row(tr);
    const rowData = row.data();

    this.editable.emit(EditableEvent.CANCEL, { tr, row, rowData });

    row.data(rowData).draw(false);

    this.editable.emit(EditableEvent.CANCELLED, { tr, row, rowData });
  }

  private async handleOnSaveEditRowClick(target: HTMLElement): Promise<void> {
    const tr = getTrFromTarget(target);
    const tds = getCellsInTr(tr);

    const row = this.dataTable.row(tr);
    const rowData = row.data();
    const oldRowData = structuredClone(rowData);

    const invalidElements: HTMLElementWithValue[] = [];
    for (const [idx, td] of tds.entries()) {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);
      if (!column.submittable) continue;

      const element = td.firstElementChild;
      if (!element || !EditorManager.isHTMLElementWithValue(element)) continue;

      const editorManager = new EditorManager(column);
      if (!editorManager.checkValidity(element)) {
        this.editable.emit(EditableEvent.INPUT_INVALID, {
          message: element.validationMessage,
          tr,
          row,
          element,
          value: element.value,
        });
        element.classList.remove(this.inpValidClass);
        element.classList.toggle(this.inpInvalidClass, true);

        invalidElements.push(element);
        break;
      }

      const field = column.field as keyof TData;
      rowData[field] = element.value as TData[typeof field];

      this.editable.emit(EditableEvent.INPUT_VALID, {
        tr,
        row,
        element,
        value: element.value,
      });
      element.classList.remove(this.inpInvalidClass);
      element.classList.toggle(this.inpValidClass, true);
    }

    if (invalidElements.length !== 0) return;

    this.editable.emit(EditableEvent.EDITED, { tr, row, rowData, oldRowData });

    const http = new HTTP(this.updateDataSrcURL);
    try {
      const response = await http.send(
        { method: this.updateDataSrcMethod as string },
        this.updateDataSrcFormat,
        rowData,
      );

      row.data(rowData).draw(false);
      this.editable.emit(EditableEvent.UPDATED, { tr, row, rowData, oldRowData, response });
      return;
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit(EditableEvent.HTTP_ERROR, {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit(EditableEvent.ERROR, {
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

    this.editable.emit(EditableEvent.DELETE, { tr, row, rowData });

    const http = new HTTP(this.deleteDataSrcURL);
    try {
      await http.send(
        { method: this.deleteDataSrcMethod as string },
        this.deleteDataSrcFormat,
        formData,
      );

      row.remove().draw(false);
      this.editable.emit(EditableEvent.DELETED, { tr, row, rowData });
      return;
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit(EditableEvent.HTTP_ERROR, {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit(EditableEvent.ERROR, {
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

    const http = new HTTP(this.postDataSrcURL);
    const defaultColumns: ColumnField[] = ['checkbox', 'delete', 'edit'] as const;
    const invalidElements: HTMLElement[] = [];

    this.editable.emit(EditableEvent.NEW_ROW_SAVE, { tr, row, rowData });

    for (const [idx, td] of tds.entries()) {
      const column = this.columns.get(idx);
      if (!column) throw new ReferenceError(`Could not find a column at index: ${idx}.`);
      if (!column.submittable) continue;

      const field = column.field as keyof TData;
      if (defaultColumns.includes(field as ColumnField)) continue;

      const element = td.firstElementChild;
      if (!element || !EditorManager.isHTMLElementWithValue(element)) continue;

      const editorManager = new EditorManager(column);

      if (!editorManager.checkValidity(element)) {
        this.editable.emit(EditableEvent.INPUT_INVALID, {
          message: element.validationMessage,
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

      this.editable.emit(EditableEvent.INPUT_VALID, {
        tr,
        row,
        element,
        value: element.value,
      });
      element.classList.remove(this.inpInvalidClass);
      element.classList.toggle(this.inpValidClass, true);
    }

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

      this.editable.emit(EditableEvent.NEW_ROW_SAVED, { tr, row, rowData, response: resData });
      return;
    } catch (err) {
      if (err instanceof ResponseError) {
        this.editable.emit(EditableEvent.HTTP_ERROR, {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
        });
        return;
      }

      this.editable.emit(EditableEvent.ERROR, {
        message: (err as Error).message,
      });
      return;
    }
  }

  private handleOnCancelNewRowClick(target: HTMLElement): void {
    const tr = getTrFromTarget(target);

    const row = this.dataTable.row(tr);

    this.editable.emit(EditableEvent.NEW_ROW_CANCEL, { tr, row });

    this.dataTable.row(tr).remove().draw(false);

    this.editable.emit(EditableEvent.NEW_ROW_CANCELLED, { tr, row });
  }
}
