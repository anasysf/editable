export function exists(arg: unknown): arg is Exclude<unknown, null | undefined> {
  return arg !== undefined && arg !== null;
}

export function isArray(arg: unknown): arg is unknown[] {
  return Array.isArray(arg);
}

export function isFn(arg: unknown): arg is (...args: unknown[]) => unknown {
  return arg instanceof Function;
}

export function isObject(arg: unknown): arg is Record<PropertyKey, unknown> {
  return exists(arg) && !isArray(arg) && !isFn(arg) && typeof arg === 'object';
}

export function getTrFromTarget(target: HTMLElement): HTMLTableRowElement {
  if (!(target instanceof HTMLTableRowElement)) {
    const tr = target.closest('tr');
    if (!tr)
      throw new ReferenceError('Could not find the closest <tr> element to the target.');

    return tr;
  }

  return target;
}

export function getElementByName<T extends HTMLElement = HTMLElement>(
  source: HTMLElement,
  name: string,
): T {
  const element = source.querySelector<T>(`[name="${name}"]`);
  if (!element) throw new ReferenceError(`Could not find an element with the name: ${name}.`);

  return element;
}

export function getTrIndex(tr: HTMLTableRowElement): number {
  return tr.rowIndex === -1 ? tr.rowIndex : tr.rowIndex - 1;
}

export function getCellsInTr(tr: HTMLTableRowElement): HTMLTableCellElement[] {
  const tds = tr.cells;
  if (tds.length === 0)
    throw new RangeError(
      `Could not find a single <td> on this <tr> element. row-index: ${getTrIndex(tr)}.`,
    );

  return Array.from(tds);
}

export function getElementNameAttribute(element: HTMLElement): string | undefined {
  const elementName = element.getAttribute('name');
  if (!elementName || elementName.trim().length === 0) return;

  return elementName;
}

export function formatNumber(
  input: unknown,
  decimals: number,
  decimal_point: string,
  separator: string,
): string {
  if (isNaN(Number(input))) throw new TypeError(`${String(input)} is not a number.`);

  const number = Number(input).toFixed(decimals).toString();
  const x = number.split('.');
  let x1 = x[0];

  if (isNaN(Number(x1))) throw new TypeError(`${x1} is not a number.`);

  x1 = x1.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return x1 + (x.length > 1 ? `${decimal_point}${x[1]}` : '');
}

function generateIconWrapperBtn(
  id: HTMLSpanElement['id'],
  title: HTMLSpanElement['title'],
  rowIdx: number,
): HTMLSpanElement {
  const iconWrapper = document.createElement('span');
  iconWrapper.id = `${id}-icon-wrapper-${rowIdx}`;
  iconWrapper.setAttribute('name', `${id}-icon`);
  iconWrapper.title = title;
  iconWrapper.role = 'button';

  return iconWrapper;
}

function generateIconBtn(
  id: HTMLElement['id'],
  title: HTMLElement['title'],
  rowIdx: number,
  className: HTMLElement['className'],
): HTMLElement {
  const icon = document.createElement('i');
  icon.id = `${id}-icon-${rowIdx}`;
  icon.setAttribute('name', `${id}-icon`);
  icon.className = className;
  icon.title = title;
  icon.role = 'button';

  return icon;
}

export function toggleIcon(
  target: EventTarget | HTMLElement,
  id: HTMLElement['id'],
  title: HTMLElement['title'],
  rowIdx: number,
  className: HTMLElement['className'],
): void {
  const fragment = document.createDocumentFragment();

  const iconWrapper = generateIconWrapperBtn(id, title, rowIdx);
  const icon = generateIconBtn(id, title, rowIdx, className);

  iconWrapper.appendChild(icon);
  fragment.appendChild(iconWrapper);

  if (target instanceof HTMLSpanElement) {
    target.replaceWith(fragment);
  } else {
    const span = (target as HTMLElement).closest('span');
    if (!span) throw new ReferenceError('Could not find a <span> element.');

    span.replaceWith(fragment);
  }
}
