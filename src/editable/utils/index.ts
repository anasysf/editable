import type { ApiRowMethods } from 'datatables.net-bs5';
import type Editable from '..';
import type SubmitButton from '../../button/submit-button';
import type { JSONValue } from '../../types';
import Icon from '../../utils/html-elements/icon';

export function replaceEditIcon<TData extends Record<string, JSONValue>>(
  row: ApiRowMethods<TData>,
  editable: Editable<TData, boolean>,
  submitButton: SubmitButton,
): HTMLSpanElement {
  const rowIdx = row.index();

  const editIconID = `edit-row-${rowIdx}-btn`;
  const editIcon = document.getElementById(editIconID);
  if (!editIcon)
    throw new ReferenceError(`Could not find an edit icon with the id: ${editIconID}.`);

  const submitIcon = submitButton.generateHTML(row, editable);
  editIcon.replaceWith(submitIcon);

  return submitIcon;
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
