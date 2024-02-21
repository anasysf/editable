import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '..';
import type CancelButton from '../../button/cancel-button';
import type SubmitButton from '../../button/submit-button';
import type { JSONValue } from '../../types';
import Icon from '../../utils/html-elements/icon';

export function replaceEditIcon<TData extends Record<string, JSONValue>>(
  row: ApiRowMethods<TData>,
  editable: Editable<TData, boolean>,
  submitButton: SubmitButton,
): HTMLSpanElement {
  const rowId = row.id().trim() !== 'undefined' ? row.id() : row.index();

  const editIconID = `edit-row-${rowId}-btn`;
  const editIcon = document.getElementById(editIconID);

  const submitIcon = submitButton.generateHTML(row, editable);
  editIcon?.replaceWith(submitIcon);

  return submitIcon;
}

export function replaceDeleteIcon<TData extends Record<string, JSONValue>>(
  row: ApiRowMethods<TData>,
  editable: Editable<TData, boolean>,
  cancelButton: CancelButton,
): HTMLSpanElement {
  const rowId = row.id().trim() !== 'undefined' ? row.id() : row.index();

  const deleteIconID = `delete-row-${rowId}-btn`;
  const deleteIcon = document.getElementById(deleteIconID);

  const cancelIcon = cancelButton.generateHTML(row, editable);
  deleteIcon?.replaceWith(cancelIcon);

  return cancelIcon;
}

export function setCancelIcon(
  rowIdx: number,
  iconClass: HTMLElement['className'],
  className?: HTMLSpanElement['className'],
): HTMLSpanElement {
  const id = `cancel-row-${rowIdx}-btn`;
  const name = 'cancel-row-btn';

  const icon = new Icon({
    id,
    icon: iconClass,
    name,
    className,
  });

  return icon.generateHTML();
}
