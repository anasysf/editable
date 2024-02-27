import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '..';
import type CancelButton from '../../button/cancel-button';
import type SubmitButton from '../../button/submit-button';
import type { JsonValue } from '../../types';
import Icon from '../../utils/html-elements/icon';

export function replaceEditIcon<T extends Record<string, JsonValue>>(
  row: ApiRowMethods<T>,
  editable: Editable<T, boolean>,
  submitButton: SubmitButton,
): HTMLSpanElement {
  const rowId = row.id().trim() === 'undefined' ? row.index() : row.id();

  const editIconId = `edit-row-${rowId}-btn`;
  const editIcon = document.getElementById(editIconId);

  const submitIcon = submitButton.generateHtml(row, editable);
  editIcon?.replaceWith(submitIcon);

  return submitIcon;
}

export function replaceDeleteIcon<T extends Record<string, JsonValue>>(
  row: ApiRowMethods<T>,
  editable: Editable<T, boolean>,
  cancelButton: CancelButton,
): HTMLSpanElement {
  const rowId = row.id().trim() === 'undefined' ? row.index() : row.id();

  const deleteIconId = `delete-row-${rowId}-btn`;
  const deleteIcon = document.getElementById(deleteIconId);

  const cancelIcon = cancelButton.generateHtml(row, editable);
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

  return icon.generateHtml();
}
