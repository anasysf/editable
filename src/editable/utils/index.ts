import Icon from '../../utils/html-elements/icon';

export function replaceEditIcon(
  rowIdx: number,
  iconClass: HTMLElement['className'],
  className?: HTMLSpanElement['className'],
): void {
  const editIconID = `edit-row-${rowIdx}-btn`;
  const editIcon = document.getElementById(editIconID);
  if (!editIcon)
    throw new ReferenceError(`Could not find an edit icon with the id: ${editIconID}.`);

  const submitIcon = setSubmitIcon(rowIdx, iconClass, className);
  editIcon.replaceWith(submitIcon);
}

function setSubmitIcon(
  rowIdx: number,
  iconClass: HTMLElement['className'],
  className?: HTMLSpanElement['className'],
): HTMLSpanElement {
  const id = `submit-row-${rowIdx}-btn`;
  const name = 'submit-row-btn';

  const icon = new Icon({
    id,
    icon: iconClass,
    name,
    className,
  });

  return icon.generateHTML();
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
